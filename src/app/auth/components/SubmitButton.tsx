import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ disabled, text, pendingText }: any) {
  const { pending } = useFormStatus();

  return (
    <button
      id="submit"
      disabled={disabled || pending}
      type="submit"
      className="disabled:opacity-50 disabled:cursor-not-allowed inline-flex justify-center gap-4 items-center bg-sky-500 hover:bg-sky-500/90 w-full p-2 rounded-lg"
    >
      {pending && <>{pendingText ? pendingText : text}</>}
      {!pending && text}
      {pending && <Loader2 className="animate-spin w-4 h-4 xl:w-5 xl:h-5" />}
    </button>
  );
}
