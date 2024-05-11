"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

type Props = {
  submitText?: string;
  onSubmitText?: string;
  cancelText?: string;
  showCancel?: true;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export default function SubmitLine({ showCancel = true, ...props }: Props) {
  const router = useRouter();
  const { pending } = useFormStatus();

  const submit = async () => {
    props.onSubmit && props.onSubmit();
  };
  const cancel = async () => {
    props.onCancel ? props.onCancel() : router.back();
  };

  return (
    <div className="flex justify-evenly flex-wrap sm:flex-nowrap items-center pt-4 gap-4 max-w-[610px] w-full max-auto">
      {showCancel && (
        <button
          type="button"
          disabled={pending}
          onClick={cancel}
          className="order:last w-full sm:order-first disabled:opacity-40 max-w-[250px] text-sm disabled:pointer-events-none p-2 bg-gray-500 hover:bg-gray-500/90 rounded-md"
        >
          {props.cancelText ?? "Cancel"}
        </button>
      )}
      <button
        type="submit"
        onClick={submit}
        disabled={pending}
        className="inline-flex justify-center gap-4 items-center w-full sm:order-first disabled:opacity-40 max-w-[250px] text-sm disabled:pointer-events-none p-2 bg-primary hover:bg-primaryHover rounded-md group-invalid/form:pointer-events-none group-invalid/form:opacity-30"
      >
        {pending ? props.onSubmitText ?? "Submit" : ""}
        {!pending && (props.submitText ?? "Submit")}
        {pending && <Loader2 className="animate-spin w-4 h-4 stroke-[3px]" />}
      </button>
    </div>
  );
}
