import { ErrorMessage, Field } from "formik";

type TextInputProps = {
  name: string;
  label: string;
  validate?: (value: string) => string | undefined;
  type?: "text" | "email" | "password" | "number";
};

type SelectInputProps = {
  name: string;
  placeholder: string;
  label: string;
  options?: { value: string; label: string }[];
};

export const TextInput = ({
  name,
  label,
  type = "text",
}: TextInputProps) => (
  <div className="flex flex-col text-left w-full">
    <label htmlFor="name" className="ml-4 text-placeholder text-primary-500">{label}</label>
    <Field
      placeholder={label}
      type={type}
      id={name}
      name={name}
      className="w-full px-3 py-2 border border-primary-900 rounded-input focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    />
    <ErrorMessage name={name} component="div" className="text-red-500" />
  </div>
);


export const SelectInput = ({
  name,
  placeholder,
  label,
  options = [],
}: SelectInputProps) => (
  <div className="mb-4">
    <label htmlFor="name" className="font-semibold">{label}</label>
    <Field
      placeholder={placeholder}
      as="select"
      id={name}
      name={name}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-1"
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" className="text-red-500" />
  </div>)
