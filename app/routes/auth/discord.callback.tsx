import { useSubmit } from "@remix-run/react";
import { useEffect } from "react";

export default function Screen() {
  let submit = useSubmit();
  console.log("hello");
  useEffect(() => {
    let fragment = new URLSearchParams(window.location.hash.slice(1));

    const accessToken = fragment.get("access_token");
    const tokenType = fragment.get("token_type");

    accessToken &&
      tokenType &&
      submit(
        { accessToken, tokenType },
        { action: "/account?index", method: "post", replace: true }
      );
  });
}
