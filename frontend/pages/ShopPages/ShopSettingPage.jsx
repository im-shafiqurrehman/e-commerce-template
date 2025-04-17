import DashBoardHeader from "../../components/SellerComponent/ShopDashBoard/DashBoardHeader";
import DashSidebar from "../../components/SellerComponent/ShopDashBoard/DashSidebar";
import ShopSetting from "../../components/SellerComponent/ShopSetting";

function ShopSettingPage() {
  return (
    <div>
      <DashBoardHeader />
     <div className="flex">
     <div>
        <DashSidebar active={11} />
      </div>
      <ShopSetting />
     </div>
    </div>
  );
}

export default ShopSettingPage;
