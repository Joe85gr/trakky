import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import {PageContainer} from "@/components/ui/page-container.tsx";

export default function ErrorPage() {
  const error = useRouteError();
    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        errorMessage = error.data.message || error.statusText;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = 'Unknown error';
    }

  console.error(error);

  return (
    <div id="error-page">
        <PageContainer>
            <h1 className="m-6">Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{errorMessage}</i>
            </p>
        </PageContainer>
    </div>
  );
}