/**
 * @module terra-draw-google-maps-adapter
 */
import { GeoJsonObject } from "geojson";
import {
  SetCursor,
  TerraDrawChanges,
  TerraDrawExtend,
  TerraDrawStylingFunction,
} from "terra-draw";

export class TerraDrawGoogleMapsAdapter extends TerraDrawExtend.TerraDrawBaseAdapter {
  constructor(
    config: {
      lib: typeof google.maps;
      map: google.maps.Map;
    } & TerraDrawExtend.BaseAdapterConfig
  ) {
    super(config);
    this._lib = config.lib;
    this._map = config.map;

    // Validate Google Maps API is available
    if (!this._lib || !this._lib.OverlayView || !this._lib.Data) {
      throw new Error("Google Maps API is not fully loaded or available");
    }

    // Validate map instance
    if (!this._map || typeof this._map.getDiv !== 'function') {
      throw new Error("Invalid Google Maps instance provided");
    }

    const mapDiv = this._map.getDiv();
    if (!mapDiv) {
      throw new Error("Google Map container div not found");
    }

    // In order for the internals of the adapter to work we require an ID to
    // allow query selectors to work
    if (!mapDiv.id) {
      console.warn("No id found for map div, this may cause issues:", {
        div: mapDiv,
        possibleSolution: "Set the id attribute on the map div",
      });
      // Set a default ID if none exists
      mapDiv.id = `google-map-${Date.now()}`;
      console.log("Set default map div ID:", mapDiv.id);
    }

    this._coordinatePrecision =
      typeof config.coordinatePrecision === "number"
        ? config.coordinatePrecision
        : 9;
  }

  private _cursor: string | undefined;
  private _cursorStyleSheet: HTMLStyleElement | undefined;
  private _lib: typeof google.maps;
  private _map: google.maps.Map;
  private _overlay: google.maps.OverlayView | undefined;
  private _clickEventListener: google.maps.MapsEventListener | undefined;
  private _mouseMoveEventListener: google.maps.MapsEventListener | undefined;

  private get _layers(): boolean {
    return Boolean(this.renderedFeatureIds?.size > 0);
  }

  /**
   * Generates an SVG path string for a circle with the given center coordinates and radius.
   * Based off this StackOverflow answer: https://stackoverflow.com/a/27905268/1363484
   * @param cx The x-coordinate of the circle's center.
   * @param cy The y-coordinate of the circle's center.
   * @param r The radius of the circle.
   * @returns The SVG path string representing the circle.
   */
  private circlePath(cx: number, cy: number, r: number) {
    const d = r * 2;
    return `M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${d},0 a ${r},${r} 0 1,0 -${d},0`;
  }

  public override register(callbacks: TerraDrawExtend.TerraDrawCallbacks) {
    super.register(callbacks);

    try {
      // Validate that map.data exists and is properly initialized
      if (!this._map.data) {
        throw new Error("Google Maps Data layer is not available");
      }

      // The overlay is responsible for allowing us to
      // get the projection, which in turn allows us to
      // go through lng/lat to pixel space and vice versa
      this._overlay = new this._lib.OverlayView();

      if (!this._overlay) {
        throw new Error("Failed to create Google Maps OverlayView");
      }

      this._overlay.draw = function () { };

      // Add the remove method that Google Maps expects
      (this._overlay as any).remove = () => {
        // This method is called by Google Maps internally
        // We don't need to do anything here as setMap(null) handles cleanup
      };

      // Unfortunately it is only ready after the onAdd
      // method is called, which is why we need to use the 'ready'
      // listener with the Google Maps adapter
      this._overlay.onAdd = () => {
        console.log("OverlayView onAdd called - Terra Draw is ready");
        if (this._currentModeCallbacks?.onReady) {
          this._currentModeCallbacks.onReady();
        }
      };

      // Set the overlay on the map
      this._overlay.setMap(this._map);

      // Set up event listeners with error handling
      try {
        // Clicking on data geometries triggers
        // swallows the map onclick event,
        // so we need to forward it to the click callback handler
        this._clickEventListener = this._map.data.addListener(
          "click",
          (
            event: google.maps.MapMouseEvent & {
              domEvent: MouseEvent;
            }
          ) => {
            try {
              const clickListener = this._listeners.find(
                ({ name }) => name === "click"
              );
              if (clickListener) {
                clickListener.callback(event);
              }
            } catch (error) {
              console.error("Error in click event handler:", error);
            }
          }
        );

        this._mouseMoveEventListener = this._map.data.addListener(
          "mousemove",
          (
            event: google.maps.MapMouseEvent & {
              domEvent: MouseEvent;
            }
          ) => {
            try {
              const mouseMoveListener = this._listeners.find(
                ({ name }) => name === "mousemove"
              );
              if (mouseMoveListener) {
                mouseMoveListener.callback(event);
              }
            } catch (error) {
              console.error("Error in mousemove event handler:", error);
            }
          }
        );
      } catch (error) {
        console.error("Error setting up map event listeners:", error);
        throw error;
      }

    } catch (error) {
      console.error("Error in Terra Draw adapter registration:", error);
      throw error;
    }
  }

  public override unregister(): void {
    super.unregister();

    try {
      // Clean up event listeners first
      if (this._clickEventListener) {
        this._clickEventListener.remove();
        this._clickEventListener = undefined;
      }

      if (this._mouseMoveEventListener) {
        this._mouseMoveEventListener.remove();
        this._mouseMoveEventListener = undefined;
      }

      // Clean up overlay - be more defensive about this
      if (this._overlay) {
        try {
          // Remove from map first
          this._overlay.setMap(null);
        } catch (error) {
          console.warn("Error removing overlay from map:", error);
        } finally {
          // Clear the reference regardless
          this._overlay = undefined;
        }
      }

      // Clean up cursor styles
      if (this._cursorStyleSheet) {
        try {
          this._cursorStyleSheet.remove();
        } catch (error) {
          console.warn("Error removing cursor stylesheet:", error);
        } finally {
          this._cursorStyleSheet = undefined;
        }
      }

    } catch (error) {
      console.error("Error during adapter unregistration:", error);
    }
  }

  /**
   * Returns the longitude and latitude coordinates from a given PointerEvent on the map.
   * @param event The PointerEvent or MouseEvent containing the screen coordinates of the pointer.
   * @returns An object with 'lng' and 'lat' properties representing the longitude and latitude, or null if the conversion is not possible.
   */
  getLngLatFromEvent(event: PointerEvent | MouseEvent) {
    if (!this._overlay) {
      throw new Error("Overlay not available - adapter may not be properly initialized");
    }

    const bounds = this._map.getBounds();
    if (!bounds) {
      return null;
    }

    try {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const latLngBounds = new this._lib.LatLngBounds(sw, ne);

      const mapCanvas = this._map.getDiv();
      if (!mapCanvas) {
        return null;
      }

      const rect = mapCanvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const screenCoord = new this._lib.Point(offsetX, offsetY);

      const projection = this._overlay.getProjection();
      if (!projection) {
        return null;
      }

      const latLng = projection.fromContainerPixelToLatLng(screenCoord);

      if (latLng && latLngBounds.contains(latLng)) {
        return { lng: latLng.lng(), lat: latLng.lat() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting lng/lat from event:", error);
      return null;
    }
  }

  /**
   * Retrieves the HTML element of the Google Map element that handles interaction events
   * @returns The HTMLElement representing the map container.
   */
  public getMapEventElement() {
    try {
      const mapDiv = this._map.getDiv();
      if (!mapDiv) {
        throw new Error("Map div not available");
      }

      // Try the standard selector first
      const selector = 'div[style*="z-index: 3;"]';
      const element = mapDiv.querySelector(selector) as HTMLDivElement;

      if (element) {
        return element;
      }

      // Fallback to the map div itself if the specific element isn't found
      console.warn("Could not find specific map event element, using map div");
      return mapDiv;
    } catch (error) {
      console.error("Error getting map event element:", error);
      throw error;
    }
  }

  /**
   * Converts longitude and latitude coordinates to pixel coordinates in the map container.
   * @param lng The longitude coordinate to project.
   * @param lat The latitude coordinate to project.
   * @returns An object with 'x' and 'y' properties representing the pixel coordinates within the map container.
   */
  project(lng: number, lat: number) {
    if (!this._overlay) {
      throw new Error("Overlay not available - adapter may not be properly initialized");
    }

    const bounds = this._map.getBounds();
    if (bounds === undefined) {
      throw new Error("Map bounds not available");
    }

    const projection = this._overlay.getProjection();
    if (projection === undefined) {
      throw new Error("Map projection not available");
    }

    try {
      const point = projection.fromLatLngToContainerPixel(
        new this._lib.LatLng(lat, lng)
      );

      if (point === null) {
        throw new Error("Cannot project coordinates - point is null");
      }

      return { x: point.x, y: point.y };
    } catch (error) {
      console.error("Error projecting coordinates:", error);
      throw error;
    }
  }

  /**
   * Converts pixel coordinates in the map container to longitude and latitude coordinates.
   * @param x The x-coordinate in the map container to unproject.
   * @param y The y-coordinate in the map container to unproject.
   * @returns An object with 'lng' and 'lat' properties representing the longitude and latitude coordinates.
   */
  unproject(x: number, y: number) {
    if (!this._overlay) {
      throw new Error("Overlay not available - adapter may not be properly initialized");
    }

    const projection = this._overlay.getProjection();
    if (projection === undefined) {
      throw new Error("Map projection not available");
    }

    try {
      const latLng = projection.fromContainerPixelToLatLng(
        new this._lib.Point(x, y)
      );

      if (latLng === null) {
        throw new Error("Cannot unproject coordinates - latLng is null");
      }

      return { lng: latLng.lng(), lat: latLng.lat() };
    } catch (error) {
      console.error("Error unprojecting coordinates:", error);
      throw error;
    }
  }

  /**
   * Sets the cursor style for the map container.
   * @param cursor The CSS cursor style to apply, or 'unset' to remove any previously applied cursor style.
   */
  setCursor(cursor: Parameters<SetCursor>[0]) {
    if (cursor === this._cursor) {
      return;
    }

    try {
      if (this._cursorStyleSheet) {
        this._cursorStyleSheet.remove();
        this._cursorStyleSheet = undefined;
      }

      if (cursor !== "unset") {
        const div = this._map.getDiv();
        if (!div || !div.id) {
          console.warn("Cannot set cursor - map div or ID not available");
          return;
        }

        const styleDivSelector = `#${div.id} .gm-style > div`;
        const styleDiv = document.querySelector(styleDivSelector);

        if (styleDiv && document) {
          styleDiv.classList.add("terra-draw-google-maps");

          const style = document.createElement("style");
          style.innerHTML = `.terra-draw-google-maps { cursor: ${cursor} !important; }`;
          const head = document.getElementsByTagName("head")[0];
          if (head) {
            head.appendChild(style);
            this._cursorStyleSheet = style;
          }
        }
      }

      this._cursor = cursor;
    } catch (error) {
      console.error("Error setting cursor:", error);
    }
  }

  /**
   * Enables or disables the double-click to zoom functionality on the map.
   * @param enabled Set to true to enable double-click to zoom, or false to disable it.
   */
  setDoubleClickToZoom(enabled: boolean) {
    try {
      this._map.setOptions({ disableDoubleClickZoom: !enabled });
    } catch (error) {
      console.error("Error setting double-click to zoom:", error);
    }
  }

  /**
   * Enables or disables the draggable functionality of the map.
   * @param enabled Set to true to enable map dragging, or false to disable it.
   */
  setDraggability(enabled: boolean) {
    try {
      this._map.setOptions({ draggable: enabled });
    } catch (error) {
      console.error("Error setting map draggability:", error);
    }
  }

  private renderedFeatureIds: Set<TerraDrawExtend.FeatureId> = new Set();

  /**
   * Renders GeoJSON features on the map using the provided styling configuration.
   * @param changes An object containing arrays of created, updated, and unchanged features to render.
   * @param styling An object mapping draw modes to feature styling functions
   */
  render(changes: TerraDrawChanges, styling: TerraDrawStylingFunction) {
    try {
      if (!this._map.data) {
        throw new Error("Google Maps Data layer not available");
      }

      if (this._layers) {
        // Handle deleted features
        changes.deletedIds.forEach((deletedId) => {
          try {
            const featureToDelete = this._map.data.getFeatureById(deletedId);
            if (featureToDelete) {
              this._map.data.remove(featureToDelete);
              this.renderedFeatureIds.delete(deletedId);
            }
          } catch (error) {
            console.error(`Error deleting feature ${deletedId}:`, error);
          }
        });

        // Handle updated features
        changes.updated.forEach((updatedFeature) => {
          try {
            if (!updatedFeature || !updatedFeature.id) {
              throw new Error("Feature is not valid");
            }

            const featureToUpdate = this._map.data.getFeatureById(
              updatedFeature.id
            );

            if (!featureToUpdate) {
              throw new Error("Feature could not be found by Google Maps API");
            }

            // Remove all existing properties
            featureToUpdate.forEachProperty((property, name) => {
              featureToUpdate.setProperty(name, undefined);
            });

            // Update all properties
            Object.keys(updatedFeature.properties).forEach((property) => {
              featureToUpdate.setProperty(
                property,
                updatedFeature.properties[property]
              );
            });

            // Update geometry based on type
            switch (updatedFeature.geometry.type) {
              case "Point":
                {
                  const coordinates = updatedFeature.geometry.coordinates;
                  if (coordinates && coordinates.length >= 2) {
                    featureToUpdate.setGeometry(
                      new this._lib.Data.Point(
                        new this._lib.LatLng(coordinates[1]!, coordinates[0]!)
                      )
                    );
                  }
                }
                break;
              case "LineString":
                {
                  const coordinates = updatedFeature.geometry.coordinates;
                  const path: google.maps.LatLng[] = [];

                  for (let i = 0; i < coordinates.length; i++) {
                    const coordinate = coordinates[i];
                    if (
                      coordinate &&
                      typeof coordinate[0] === "number" &&
                      typeof coordinate[1] === "number"
                    ) {
                      const latLng = new this._lib.LatLng(
                        coordinate[1],
                        coordinate[0]
                      );
                      path.push(latLng);
                    }
                  }

                  featureToUpdate.setGeometry(new this._lib.Data.LineString(path));
                }
                break;
              case "Polygon":
                {
                  const coordinates = updatedFeature.geometry.coordinates;
                  const paths: google.maps.LatLng[][] = [];

                  for (let i = 0; i < coordinates.length; i++) {
                    const ring = coordinates[i];
                    if (ring && Array.isArray(ring)) {
                      const path: google.maps.LatLng[] = [];

                      for (let j = 0; j < ring.length; j++) {
                        const coord = ring[j];
                        if (coord && coord.length >= 2) {
                          const latLng = new this._lib.LatLng(
                            coord[1]!,
                            coord[0]!
                          );
                          path.push(latLng);
                        }
                      }
                      paths.push(path);
                    }
                  }

                  featureToUpdate.setGeometry(new this._lib.Data.Polygon(paths));
                }
                break;
            }
          } catch (error) {
            console.error(`Error updating feature ${updatedFeature?.id}:`, error);
          }
        });

        // Create new features
        changes.created.forEach((createdFeature) => {
          try {
            this.renderedFeatureIds.add(createdFeature.id as string);
            this._map.data.addGeoJson(createdFeature);
          } catch (error) {
            console.error(`Error creating feature ${createdFeature?.id}:`, error);
          }
        });
      } else {
        // Initial render - add all created features
        changes.created.forEach((feature) => {
          this.renderedFeatureIds.add(feature.id as string);
        });

        const featureCollection = {
          type: "FeatureCollection",
          features: [...changes.created],
        } as GeoJsonObject;

        this._map.data.addGeoJson(featureCollection);
      }

      // Apply styling
      this._map.data.setStyle((feature) => {
        try {
          const mode = feature.getProperty("mode") as any;
          const gmGeometry = feature.getGeometry();

          if (!gmGeometry) {
            console.warn("Google Maps geometry not found for feature");
            return {};
          }

          const type = gmGeometry.getType();
          const properties: Record<string, any> = {};

          feature.forEachProperty((value, property) => {
            properties[property] = value;
          });

          if (!styling[mode]) {
            console.warn(`No styling function found for mode: ${mode}`);
            return {};
          }

          const calculatedStyles = styling[mode]!({
            type: "Feature",
            geometry: {
              type: type as "Point" | "LineString" | "Polygon",
              coordinates: [],
            },
            properties,
          });

          switch (type) {
            case "Point":
              const path = this.circlePath(0, 0, calculatedStyles.pointWidth || 5);
              return {
                clickable: false,
                icon: {
                  path,
                  fillColor: calculatedStyles.pointColor || "#000000",
                  fillOpacity: 1,
                  strokeColor: calculatedStyles.pointOutlineColor || "#000000",
                  strokeWeight: calculatedStyles.pointOutlineWidth || 1,
                  rotation: 0,
                  scale: 1,
                },
              };

            case "LineString":
              return {
                strokeColor: calculatedStyles.lineStringColor || "#000000",
                strokeWeight: calculatedStyles.lineStringWidth || 2,
              };

            case "Polygon":
              return {
                strokeColor: calculatedStyles.polygonOutlineColor || "#000000",
                strokeWeight: calculatedStyles.polygonOutlineWidth || 2,
                fillOpacity: calculatedStyles.polygonFillOpacity || 0.3,
                fillColor: calculatedStyles.polygonFillColor || "#000000",
              };

            default:
              console.warn(`Unknown geometry type: ${type}`);
              return {};
          }
        } catch (error) {
          console.error("Error applying feature styling:", error);
          return {};
        }
      });

    } catch (error) {
      console.error("Error rendering features:", error);
    }
  }

  private clearLayers() {
    try {
      if (this._layers && this._map.data) {
        this._map.data.forEach((feature) => {
          try {
            const id = feature.getId() as string;
            const hasFeature = this.renderedFeatureIds.has(id);
            if (hasFeature) {
              this._map.data.remove(feature);
            }
          } catch (error) {
            console.error(`Error removing feature during clear:`, error);
          }
        });
        this.renderedFeatureIds = new Set();
      }
    } catch (error) {
      console.error("Error clearing layers:", error);
    }
  }

  /**
   * Clears the map and store of all rendered data layers
   * @returns void
   * */
  public clear() {
    try {
      if (this._currentModeCallbacks) {
        // Clean up state first
        this._currentModeCallbacks.onClear();

        // Then clean up rendering
        this.clearLayers();
      }
    } catch (error) {
      console.error("Error clearing Terra Draw adapter:", error);
    }
  }

  public override getCoordinatePrecision(): number {
    return super.getCoordinatePrecision();
  }
}
