import { Suspense } from "react";
import VerifyOTP from "../../components/VerifyOTP";
import Loading from "../../components/Loading";

export default function VerifyPage() {

    return (
        <Suspense fallback={<Loading />}>
            <VerifyOTP />
        </Suspense>
    );
}
