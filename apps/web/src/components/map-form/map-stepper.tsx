import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import dynamic from "next/dynamic";
import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import MapDetailsForm from "./details";
import MapShareForm from "./share";
import { useMapFormContext } from "./provider";

const MapLocationForm = dynamic(() => import("./location"), { ssr: false });

const steps = [
  {
    id: "name",
    title: "Name",
    description: "Basic information",
    component: MapDetailsForm,
  },
  {
    id: "location",
    title: "Location",
    description: "Set default location",
    component: MapLocationForm,
  },
  {
    id: "share",
    title: "Share",
    description: "Share with others",
    component: MapShareForm,
  },
] as const;

const MapStepperForm = () => {
  const {
    form,
    onSubmit
  } = useMapFormContext();
  const {formState: { errors }} = form;
  const [currentStep, setCurrentStep] = React.useState(1);

  const next = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (onSubmit) {
      onSubmit();
    }
  };

  const prev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Ensure we have a valid step index
  const stepIndex = Math.min(Math.max(0, currentStep - 1), steps.length - 1);
  const StepComponent = steps[stepIndex]!.component;

  return (
    <div className="relative flex flex-col justify-between h-ull w-full space-y-3 pb-4">
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        {steps.map((step, index) => (
          <StepperItem
            key={step.id}
            step={index + 1}
            completed={currentStep > index + 1}
            className="flex-col! relative flex-1"
            onError={() => {
              switch (step.id) {
                case "name":
                  return errors?.title || errors?.description;
                case "location":
                  return (
                    errors?.lat || errors?.lng || errors?.bounds
                  );
                default:
                  return false;
              }
            }}
          >
            <StepperTrigger className="flex-col gap-3 rounded">
              <StepperIndicator />
              <div className="space-y-0.5 px-2">
                <StepperTitle>{step.title}</StepperTitle>
                <StepperDescription className="max-sm:hidden">
                  {step.description}
                </StepperDescription>
              </div>
            </StepperTrigger>
            {index < steps.length - 1 && (
              <StepperSeparator className="absolute inset-x-0 left-[calc(50%+0.75rem+0.125rem)] top-3 -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
            )}
          </StepperItem>
        ))}
      </Stepper>

      {/* Form */}
      <StepComponent />

      {/* Navigation */}
      <div className="absolute -bottom-4 left-2 right-2 flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prev}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button type="button" onClick={next}>
          {currentStep === steps.length ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default MapStepperForm;
