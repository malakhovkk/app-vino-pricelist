import axios from "axios";

// const base_url = "http://194.87.239.231:201/api/1c";
// const url = "http://194.87.239.231:201";
const url = "http://127.0.0.1:8000";
const base_url = "http://127.0.0.1:8000/api/1c";

export const getGroups = async (product_id) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    const response = await axios.get(`${base_url}/group`, {});
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const loadExcel = async (formData) => {
  try {
    const response = await axios.post(`${url}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const saveExcel = async ({
  vendorId,
  profileId,
  document,
  fileName,
}) => {
  const formData = new FormData();
  formData.append("VendorId", vendorId);
  formData.append("ProfileId", profileId);
  formData.append("UserLogin", localStorage.getItem("login"));
  var myBlob = new Blob([document], { type: "text/xml" });
  let pos = fileName.lastIndexOf(".");
  fileName = fileName.substr(0, pos < 0 ? fileName.length : pos) + ".xml";
  formData.append("Document", myBlob, fileName);
  console.log("APIRest.saveExcel.Filename >>>", fileName);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("login");
  try {
    const response = await axios.post(
      `http://194.87.239.231:55555/api/file`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          User: user,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("APIRest.saveExcel >>>", response);
    return response;
  } catch (err) {
    console.log("APIRest.saveExcel >>>", err);
    return err;
  }
};

export const getPartners = async (product_id) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${base_url}/partners`, {});
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getRest = async ({ taxid, stock_uid }) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let params = {};
    if (taxid) {
      params["taxid"] = taxid;
    }
    if (stock_uid) {
      params["stock_uid"] = stock_uid;
    }
    const response = await axios.get(`${base_url}/rest`, { params });
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getInvoices = async ({ date1, date2, partner_uid, shopid }) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    //const token = localStorage.getItem("token");
    //const user = localStorage.getItem("login");
    // console.log(token);
    console.log(
      "restAPI.getInvoices",
      date1,
      date2,
      "partner_uid=",
      partner_uid,
      "shopid=",
      shopid
    );
    const params = { date1: date1, date2: date2 };
    if (partner_uid) {
      params["taxid"] = partner_uid;
    }
    if (shopid) {
      params["stock_id"] = shopid;
    }
    const response = await axios.get(
      //  `${base_url}/invoices?date1=${date1}&date2=${date2}&taxid=${partner_uid}&stock_id=${shopid}`
      `${base_url}/invoices`,
      { params }
    );
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getAbc = async ({ date1, date2 }) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    // console.log(token);
    // console.log(date1, date2);
    const response = await axios.get(
      `${base_url}/abc?date1=${date1}&date2=${date2}`
    );
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getInvoicesItems = async ({ invoice_uid }) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    // console.log(token);
    // console.log(date1, date2);
    const response = await axios.get(
      `${base_url}/invoices_items?invoice_uid=${invoice_uid}`
    );
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getPayments = async ({ date1, date2, taxid }) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    // console.log(date1, date2);
    const params = { date1: date1, date2: date2 };
    if (taxid) {
      params["taxid"] = taxid;
    }
    const response = await axios.get(`${base_url}/payments`, { params });
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getRevenue2 = async ({ date1, date2, shopid, groupid }) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    const params = { date1: date1, date2: date2 };
    console.log("GROUPID=", groupid);
    if (date1) {
      params["date1"] = date1;
    }
    if (date2) {
      params["date2"] = date2;
    }
    if (shopid) {
      params["shopid"] = shopid;
    }
    console.log(groupid);
    if (groupid) {
      params["group_unit"] = groupid;
    }
    // console.log(token);
    // console.log(date1, date2);
    const response = await axios.get(`${base_url}/revenue2`, { params });
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getInv = async ({ date1, date2 }) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    //const token = localStorage.getItem("token");
    //const user = localStorage.getItem("login");
    //console.log(token);
    console.log("server API func getInv", date1, date2);
    const response = await axios.get(
      `${base_url}/inv?date1=${date1}&date2=${date2}`
    );
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getContent = async ({ uid }) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${base_url}/get-content?uid=${uid}`);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getStatistics = async ({ stock_uid }) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let response;
    if (!stock_uid)
      response = await axios.get(`${base_url}/statistics?stock_uid=`, {});
    else
      response = await axios.get(
        `${base_url}/statistics?stock_uid=${stock_uid}`,
        {}
      );
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getStr = async ({ date1, date2, shopid, groupid }) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let params = {};
    params["date1"] = date1;
    params["date2"] = date2;
    if (shopid) params["shopid"] = shopid;
    if (groupid) params["group_unit"] = groupid;
    const response = await axios.get(`${base_url}/str`, { params });
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};
