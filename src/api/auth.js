import myUserInfo from "../utils/default-user";
import defaultUser from "../utils/default-user";
import axios from "axios";
import * as CONST_API from "../constAPI/constAPI";

export async function signIn(email, password) {
  try {
    const getUser = await axios.post(
      `http://${CONST_API.IP}/${CONST_API.LOGON}`,
      {
        login: email,
        password,
      }
    );

    const response = getUser;

    // localStorage.clear();
    localStorage.setItem("login", response.data.user.login);
    localStorage.setItem("token", response.data.result);

    // Send request
    console.log(email, password);

    //window.userInfo.login = response.data.user.login;
    //window.userInfo.token = response.data.result;

    defaultUser.login = response.data.user.login;
    defaultUser.token = response.data.result;

    return {
      isOk: true,
      data: defaultUser,
    };
  } catch {
    return {
      isOk: false,
      message: "SignIn failed",
    };
  }
}
// axios("http://194.87.239.231:55555/api/Vendor?have_pricelist=1", {
//   headers: {
//     //"content-type": "application/x-www-form-urlencoded",
//     //Authorization: `Bearer ${localStorage.getItem("token1")}`,
//     //User: `${localStorage.getItem("login1")}`,

//     //Authorization: `Bearer ${getUser().data.token}`,
//     //User: getUser().data.login,

//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//     User: localStorage.getItem("login"),
//   },
// }).then((data) => {
//   setSrc(data.data);
// });
export async function getVendorArray(email, password) {
  try {
    const getUser = await axios.post(
      `http://${CONST_API.IP}/${CONST_API.LOGON}`,
      {
        login: email,
        password,
      }
    );

    const response = getUser;

    // localStorage.clear();
    localStorage.setItem("login", response.data.user.login);
    localStorage.setItem("token", response.data.result);

    // Send request
    console.log(email, password);

    //window.userInfo.login = response.data.user.login;
    //window.userInfo.token = response.data.result;

    defaultUser.login = response.data.user.login;
    defaultUser.token = response.data.result;

    return {
      isOk: true,
      data: defaultUser,
    };
  } catch {
    return {
      isOk: false,
      message: "SignIn failed",
    };
  }
}
export async function getVendorList() {
  try {
    //console.log(defaultUser);
    const vendorsList = await axios(
      `http://194.87.239.231:55555/${CONST_API.GET_VENDORS}`,
      {
        headers: {
          //"content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          User: `${localStorage.getItem("login")}`,
        },
      }
    );
    console.log(vendorsList.data);
    return {
      isOk: true,
      //isOk: true,
      data: vendorsList.data, // window.userInfo,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}
export async function getPriceList() {
  try {
    //console.log(defaultUser);
    const vendorsList = await axios(
      `http://194.87.239.231:55555/${
        CONST_API.GET_PRICELIST
      }/${localStorage.getItem("vendorId")}`,
      {
        headers: {
          //"content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          User: `${localStorage.getItem("login")}`,
        },
      }
    );
    console.log(vendorsList.data);
    return {
      isOk: true,
      //isOk: true,
      data: vendorsList.data, // window.userInfo,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}
export async function getUser2() {
  try {
    //console.log(defaultUser);

    return {
      isOk: defaultUser.token !== "",
      //isOk: true,
      data: defaultUser, // window.userInfo,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}
export async function getRemainingProducts() {
  try {
    console.log("[REST API] getDeals");
    const products = await axios(
      `http://194.87.239.231:55555/api/RemainingProducts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          User: `${localStorage.getItem("login")}`,
        },
      }
    );
    console.log("REST API]", products.data);
    return {
      isOk: true,
      //isOk: true,
      data: products.data, // window.userInfo,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}
export async function getDeals(data) {
  try {
    console.log("[REST API] getDeals");
    if (data !== undefined) {
      const {
        shop,
        status,
        deal_type,
        date1,
        date2,
        statusVP: statusvp,
      } = data;
      console.log(data);
      if (date1 === undefined || date2 === undefined) {
        alert("Заполните даты");
        return {
          isOk: false,
        };
      }
      let str =
        `http://194.87.239.231:55555/api/deal?` +
        (shop ? `shop=${shop}&` : "") +
        (status ? `status=${status}&` : "") +
        (deal_type ? `deal_type=${deal_type}&` : "") +
        (statusvp ? `statusvp=${statusvp}&` : "") +
        `date1=${date1}&date2=${date2}`;
      const deals = await axios(`${str}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          User: `${localStorage.getItem("login")}`,
        },
      }).catch((error) => {
        if ((error.response.status = 401)) {
          resetLogin();
          console.log("REST API] error=", error);
        }
      });
      console.log("REST API]", deals.data);
      return {
        isOk: true,
        //isOk: true,
        data: deals.data, // window.userInfo,
      };
    }
    const deals = await axios(`http://194.87.239.231:55555/api/deal`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        User: `${localStorage.getItem("login")}`,
      },
    }).catch((error) => {
      if ((error.response.status = 401)) {
        resetLogin();
        console.log("REST API] error=", error);
      }
    });
    console.log("REST API]", deals.data);
    return {
      isOk: true,
      //isOk: true,
      data: deals.data, // window.userInfo,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}

export async function getDealItem(dataDeal) {
  try {
    console.log(
      `run REST getDealItem(dealId=${dataDeal.dealId}; ownerId=${dataDeal.ownerId})`
    );
    const answer = await axios(
      `http://${CONST_API.HOST}/api/deal/${dataDeal.dealId}`,

      {
        params: { owner: dataDeal.ownerId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          User: `${localStorage.getItem("login")}`,
        },
      }
    );
    console.log(answer.data);
    return {
      isOk: true,
      data: answer.data,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}

export async function updateDealExtraInfo({
  dealId,
  ownerId,
  comment,
  dateShipment,
}) {
  console.log(
    "API updateDealExtraInfo",
    dealId,
    ownerId,
    comment,
    dateShipment
  );
  return await axios({
    method: "post",
    url: `http://${CONST_API.IP}/api/deal`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      User: `${localStorage.getItem("login")}`,
    },
    data: {
      dealId,
      ownerId,
      comment,
      dateShipment,
    },
  });
}

export async function receiveTable({ dealId, ownerId }) {
  let res = await axios({
    method: "get",
    url: `http://${CONST_API.IP}/api/DealStatusVPHistory/${dealId}?owner=${ownerId}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      User: `${localStorage.getItem("login")}`,
    },
  });
  return res.data;
}
const sendAdditionalInfo = async () => {
  // if (!date) {
  //   alert("Ошибка при вводе");
  //   return;
  // }
};

export async function setStatusDeal(data) {
  try {
    console.log("run REST setStatusDeal.data", data);
    // let res = await axios.put(
    //   "http://194.87.239.231:55555/api/deal",
    //   userData,

    // const data = {
    //   // идентификатор/номер сделки/заказа
    //   dealid: dataDeal.dealId,
    //   // собственник сделки сделки/заказа - Лудинг,Прощян или др.
    //   ownerid: dataDeal.ownerId,
    //   status: statusVP,
    // };
    const answer = await axios.put(`http://${CONST_API.IP}/api/deal`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        User: `${localStorage.getItem("login")}`,
      },
    });
    console.log("setStatusDeal.answer", answer.data);
    return {
      isOk: true,
      data: answer.data,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}

export async function getLogin() {
  try {
    //console.log("defaultUser >>", defaultUser);
    // восстанавливаю значения переменную
    defaultUser.token = localStorage.getItem("token");
    defaultUser.login = localStorage.getItem("login");
    if (defaultUser.token !== "") {
      throw new Error("user erorr");
    }
    return {
      isOk: defaultUser.token !== "",
      //isOk: true,
      data: defaultUser, // window.userInfo,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}

export async function resetLogin() {
  localStorage.removeItem("token");
  localStorage.removeItem("login");
}

export async function createAccount(email, password) {
  try {
    // Send request
    console.log(email, password);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to create account",
    };
  }
}

export async function changePassword(email, recoveryCode) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to change password",
    };
  }
}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to reset password",
    };
  }
}
