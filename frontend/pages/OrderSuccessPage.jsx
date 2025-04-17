import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lottie from "react-lottie";
import animationData from "@/Assests/animations/107043-success.json";
import CheckOutSteps from "@/components/CheckOut/CheckOutSteps";

function OrderSuccessPage() {
  return (
    <div>
      <Header />
      <CheckOutSteps active={3} />
      <Success />
      <Footer />
    </div>
  );
}

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={200} />
      <h5 className="mb-14 text-center text-[25px] text-[#000000a1]">
        Your order is successful 😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;