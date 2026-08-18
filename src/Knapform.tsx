import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { KnowledgeFormValues } from "./data/types";

type KnapFormProps = {
  onSubmitNode: (values: KnowledgeFormValues) => void;
};

export default function KnapForm({ onSubmitNode }: KnapFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KnowledgeFormValues>({
    defaultValues: {
      title: "",
      type: "Goal",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<KnowledgeFormValues> = (data) => {
    onSubmitNode(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="knap-form">
      <label>
        Knowledge title
        <input
          type="text"
          {...register("title", {
            required: "A title is required",
            minLength: {
              value: 3,
              message: "Use at least 3 characters",
            },
            maxLength: {
              value: 60,
              message: "Keep the title under 60 characters",
            },
          })}
        />
      </label>
      {errors.title && (
        <span className="field-error">{errors.title.message}</span>
      )}

      <label>
        Knowledge type
        <select {...register("type", { required: "Choose a knowledge type" })}>
          <option value="Goal">Goal</option>
          <option value="Tool">Tool</option>
          <option value="Skill">Skill</option>
          <option value="Concept">Concept</option>
          <option value="Project">Project</option>
        </select>
      </label>
      {errors.type && (
        <span className="field-error">{errors.type.message}</span>
      )}

      <label>
        Description
        <textarea
          {...register("description", {
            required: "Add a short description",
            minLength: {
              value: 12,
              message: "Describe the node in at least 12 characters",
            },
            maxLength: {
              value: 220,
              message: "Keep the description within 220 characters",
            },
          })}
          rows={4}
        />
      </label>
      {errors.description && (
        <span className="field-error">{errors.description.message}</span>
      )}

      <button type="submit" className="primary-button">
        Add knowledge node
      </button>
    </form>
  );
}
