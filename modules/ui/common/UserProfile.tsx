import React from "react";

import { useNavigation } from "@niveshstar/hook";

import CustomCard from "../CustomCard";
import Padding from "../Padding";
import Cart from "./cart/Cart";
import ManualImport from "./casImport/ManualImport";
import InvestorPortfolio from "./home/InvestorPortfolio";
import Mandates from "./mandates/Mandates";
import SchemeList from "./mutual-funds/SchemeList";
import SchemeSingle from "./mutual-funds/SchemeSingle";
import ProcessedOrder from "./orders/Orders";
import Profile from "./profile/Profile";
import SipList from "./sip/SipList";
import UserNav from "./UserNav";
import InvestorRiskProfiling from "./risk/InvestorRiskProfiling";

function UserProfile() {
  const { params } = useNavigation();
  const currTab = params?.userTab || "0";

  return (
    <>
      <UserNav />
      <Padding height={16} />

      {currTab === "0" ? <InvestorPortfolio /> : null}
      {currTab === "1" ? <Profile /> : null}
      {currTab === "2" ? <InvestorRiskProfiling /> : null}
      {currTab === "3" ? (
        <CustomCard style={{ flexGrow: 1 }}>
          <Mandates />
        </CustomCard>
      ) : null}
      {currTab === "4" ? <Cart /> : null}
      {currTab === "5" ? <ProcessedOrder /> : null}
      {currTab === "6" ? <SipList /> : null}
      {currTab === "7" ? (
        <CustomCard style={{ flexGrow: 1 }}>
          <ManualImport />
        </CustomCard>
      ) : null}
      {/* {currTab === "8" ? <Notes /> : null} */}
      {currTab === "9" ? <SchemeList /> : null}
      {currTab === "10" ? <SchemeSingle /> : null}
      {/* {currTab === "11" ? <Reports /> : null} */}
    </>
  );
}

export default React.memo(UserProfile);
