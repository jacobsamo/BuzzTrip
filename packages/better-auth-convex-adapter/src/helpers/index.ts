// import { getAuthTables } from "better-auth/db";
// import type { BetterAuthOptions } from "better-auth";


// const convex_data_types = [
//     { key: "id", convexType: "Id", tsType: "Id<string>"},
//     { key: "null", convexType: "Null", tsType: "null"},
//     { key: "int64", convexType: "Int64", tsType: "bigint"},
//     { key: "number", convexType: "Float64", tsType: "number"},
//     { key: "boolean", convexType: "Boolean", tsType: "boolean"},
//     { key: "string", convexType: "String", tsType: "string"},
//     { key: "bytes", convexType: "Bytes", tsType: "ArrayBuffer"},
//     { key: "array", convexType: "Array", tsType: "Array"},
//     { key: "object", convexType: "Object", tsType: "Object"},
//     { key: "record", convexType: "Record", tsType: "Record"},
// ] as const;

// type ConvexTypes = (typeof convex_data_types)[number]["key"];

// type Field = {
// 	type: ConvexTypes;
// 	optional: boolean;
// 	name: string;
// };

// type Table = Record<string, Record<string, Field>>;

// function convert_better_auth_to_convex_schema(
//     BAOptions: BetterAuthOptions,
// ) {
//     const tables = getAuthTables(BAOptions);
//     const convex_schema = {};

//     for (const [tableKey, table] of Object.entries(tables)) {}

//     return convex_schema
// }


// function convert_plugins_to_convex_schema(
// 	BAOptions: BetterAuthOptions,
// 	existing_tables: Table,
// ): string {
// 	const all_schemas: string[] = [];

// 	const tables = getAuthTables(BAOptions);

// 	for (const [tableKey, table] of Object.entries(tables)) {
// 		// for each schema within the plugin
// 		const modelName = table.modelName;
// 		const existing_table: Record<string, Field> | undefined =
// 			existing_tables[modelName];

// 		const schema_start = `${modelName}: defineTable({\n`;
// 		let schema_body = ``;
// 		const schema_ending = `}),`;
// 		const all_field_names: string[] = [];

// 		for (const [key_field_name, field] of Object.entries(table.fields)) {
// 			const field_name = field.fieldName || key_field_name;
// 			all_field_names.push(field_name);
// 			let type: ConvexTypes = "string";
// 			const isOptional = !field.required;

// 			if (field_name === "id" || field.references?.model) type = "id";
// 			else if (field.type === "boolean") type = "boolean";
// 			else if (field.type === "number") type = "number";
// 			else if (field.type === "string") type = "string";
// 			else if (field.type === "date") type = "string";
// 			else if (field.type === "number[]" || field.type === "string[]")
// 				type = "array";

// 			let contents = "";
// 			if (type === "id") {
// 				if (field.references?.model) contents = `"${field.references.model}"`;
// 				else contents = `"${modelName}"`;
// 			}

// 			schema_body += `${field_name}: ${isOptional && type !== "id" ? `v.optional(v.${type}(${contents}))` : `v.${type}(${contents})`},\n`;
// 		}

// 		if (existing_table) {
// 			for (const [field_name, field] of Object.entries(existing_table).filter(
// 				(x) => !all_field_names.includes(x[0]),
// 			)) {
// 				const { type, optional } = field;
// 				schema_body += `${field_name}: ${optional ? `v.optional(v.${type}())` : `v.${type}()`},\n`;
// 			}
// 		}

// 		all_schemas.push(`${schema_start}${schema_body}${schema_ending}`);
// 	}

// 	all_schemas.splice(
// 		0,
// 		0,
// 		convert_parsed_schema_to_convex_schema(
// 			Object.fromEntries(
// 				Object.entries(existing_tables).filter(
// 					([table_name, fields]) =>
// 						!Object.entries(tables)
// 							.map((x) => x[1].modelName)
// 							.includes(table_name),
// 				),
// 			),
// 		),
// 	);

// 	return all_schemas.join("\n");
// }