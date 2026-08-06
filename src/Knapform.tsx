// import ReactDOM from "react-dom"
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

// type GenderEnum = "female" | "male" | "other";

interface IFormInput {
  knapName: string;
  knapDescription: string;
  //   gender: GenderEnum;
}

export default function KnapForm() {
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Knap Name</label>
      <input
        {...register("knapName", {
          required: true,
          minLength: 10,
          maxLength: 50,
        })}
      />
      <label>Knap Description</label>
      <input
        {...register("knapDescription", {
          required: true,
          minLength: 25,
          maxLength: 200,
        })}
      />
      {/* <label>Gender Selection</label> */}
      {/* <select {...register("gender")}>
        <option value="female">female</option>
        <option value="male">male</option>
        <option value="other">other</option>
      </select> */}
      <input type="submit" />
    </form>
  );
}
