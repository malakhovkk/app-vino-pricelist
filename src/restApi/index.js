import axios from "axios";

// const base_url = "http://194.87.239.231:55555";
const base_url = "http://127.0.0.1:8000";
const IP = "http://194.87.239.231:55555";
export const getVendors = async () => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/Vendor?have_pricelist=1`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {}
};

export const GetStocks = async () => {
  //{ запрос {{base_url}}/api/shop/e419c34f-6856-11ea-8298-001d7dd64d88 }
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("login");
  let IP = `http://194.87.239.231:55555`;
  try {
    const response = await axios.get(
      `${IP}/api/shop/e419c34f-6856-11ea-8298-001d7dd64d88`,
      {
        headers: {
          User: user,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("GetStocks>>>", response.data);
    return response.data;
  } catch (e) {}
};

export const GetOrders = async (vendorId) => {
  //{ запрос {{base_url}}/api/shop/e419c34f-6856-11ea-8298-001d7dd64d88 }
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("login");
  try {
    const response = await axios.get(`${IP}/api/order/${vendorId}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("GetStocks>>>", response.data);
    return response.data;
  } catch (e) {}
};

export const GetOrdercontent = async (orderId) => {
  //{ запрос {{base_url}}/api/shop/e419c34f-6856-11ea-8298-001d7dd64d88 }
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("login");
  try {
    const response = await axios.get(`${IP}/api/ordercontent/${orderId}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const createOrder = async ({ vendorId, shopId, comment }) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.post(
      `${IP}/api/order`,
      {
        vendorId,
        number: "",
        shopId,
        comment,
        emailSend: "",
      },
      {
        headers: {
          User: user,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {}
};

export const addItems = async (content) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.post(`${IP}/api/ordercontent`, content, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {}
};

export const addNewProfile = async (content) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.post(`${IP}/api/Profile`, content, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {}
};

export const editProfile = async (content) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.put(`${IP}/api/Profile`, content, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {}
};

export const fetchDataDeals = async (data) => {
  try {
    const { shop, status, deal_type, date1, date2 } = data;
    console.log(data);
    alert();
    const info = await axios.get(
      `${IP}/api/deal?shop=${shop}&date1=${date1}&date2=${date2}&status=${status}&deal_type=${deal_type}`,

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          User: `${localStorage.getItem("login")}`,
        },
      }
    );
    return info;
  } catch (e) {}
};

export const sendEmail = async (content) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.put(`${IP}/api/OrderSend`, content, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {}
};

// {{base_url}}/api/product

export const getProduct = async (product_id) => {
  // {{base_url}}/api/document/{{vendor_id}}
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/product/${product_id}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {}
};

export const getImage = async (product_id) => {
  // {{base_url}}/api/document/{{vendor_id}}
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(
      `${IP}/api/Image?product=${product_id}&type=2`,
      {
        headers: {
          User: user,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {}
};

export const getPricelist = async (vendor_id) => {
  // {{base_url}}/api/document/{{vendor_id}}
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    //console.log(token);
    const response = await axios.get(`${IP}/api/document/${vendor_id}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.debug("getPricelist", response.data);
    return response.data;
  } catch (e) {}
};

export const getContacts = async (vendorId) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/VendorContact/${vendorId}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (e) {}
};

export const saveContactChanges = async (contact) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.put(`${IP}/api/VendorContact/`, contact, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};
// /api/VendorContact

export const createContact = async (contact) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    const response = await axios.post(`${IP}/api/VendorContact/`, contact, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const getUsers = async (contact) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/user/`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const getProfiles = async (vendorId) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/Profile?vendorId=${vendorId}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const getCodes = async (vendorId) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/Dictionary/7`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const get1C = async (vendorId) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${base_url}/api/1c/${vendorId}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const sendBinds = async (products, groups) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    let res = [];
    products.forEach((product) => {
      groups.forEach((group) => {
        res.push({
          ProductSkuId: product,
          GroupRecId: group,
        });
      });
    });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.post(`${IP}/api/bind`, res, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};
export const deleteBind = async (id) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.delete(`${IP}/api/bind/${id}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};
export const getBinds = async (product_id) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/product/${product_id}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getStaff = async () => {
  try {
    const response = await axios.get(`${base_url}/api/staff`);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};
export const editStaff = async (user) => {
  try {
    console.log(user);
    const response = await axios.put(`${base_url}/api/staff`, user);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const deleteStaff = async (id) => {
  try {
    const response = await axios.delete(`${base_url}/api/staff/${id}`);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const createStaff = async (user) => {
  try {
    const response = await axios.post(`${base_url}/api/staff`, user);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const addSchedule = async (schedule) => {
  try {
    const response = await axios.post(`${base_url}/api/schedule`, schedule);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const addToPointsInfo = async (pointsInfo) => {
  try {
    const response = await axios.post(`${base_url}/api/points`, pointsInfo);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getPointsInfo = async () => {
  try {
    const response = await axios.get(`${base_url}/api/points`);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const editPointsInfo = async (pointsInfo) => {
  try {
    const response = await axios.put(`${base_url}/api/points`, pointsInfo);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const addStaffPoints = async (info) => {
  try {
    const response = await axios.post(`${base_url}/api/staff_points`, info);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const deleteStaffPoints = async (id) => {
  try {
    const response = await axios.delete(`${base_url}/api/staff_points/${id}`);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};
export const getStaffPointsById = async (id) => {
  try {
    const response = await axios.get(`${base_url}/api/staff_points/${id}`);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};
export const deletePoints = async (id) => {
  try {
    const response = await axios.delete(`${base_url}/api/points/${id}`);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getSchedule = async (schedule) => {
  try {
    const response = await axios.get(`${base_url}/api/schedule`);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getScheduleById = async (id) => {
  try {
    const response = await axios.get(`${base_url}/api/schedule/${id}`);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const deleteSchedule = async (id) => {
  try {
    const response = await axios.delete(`${base_url}/api/schedule/${id}`);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const editSchedule = async (schedule) => {
  try {
    const response = await axios.put(`${base_url}/api/schedule/`, schedule);
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getCategories = async (vendorId) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/Dictionary/1?type=1`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const createGroups = async (res, groups) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    groups.forEach(async (group) => {
      const response = await axios.post(
        `${IP}/api/UserGroup/`,
        [{ userId: res, groupId: group }],
        {
          headers: {
            User: user,
            Authorization: `Bearer ${token}`,
          },
        }
      );
    });
    // console.log(response.data);
    // return response.data;
  } catch (e) {}
};

export const getGroupsByUserid = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/Groups/${id}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};
export const addUserToGroup = async (info) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.post(`${IP}/api/UserGroup`, info, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const deleteUserFromGroup = async (info) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.delete(`${IP}/api/UserGroup`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
      data: info,
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const getMarksByUid = async (uid) => {
  try {
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    const response = await axios.get(`${base_url}/api/marks/${uid}`);
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const getMarksDiff = async (uid) => {
  try {
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    const response = await axios.get(`${base_url}/api/marksDiff/${uid}`);
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const markFind = async (code) => {
  try {
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    const response = await axios.get(`${base_url}/api/markFind/${code}`);
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const getRights = async () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/Rights`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

// export const addRights = async (info) => {
//   try {
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("login");
//     console.log(token);
//     const response = await axios.post(`${IP}/api/GroupRight`, info, {
//       headers: {
//         User: user,
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log(response.data);
//     return response.data;
//   } catch (e) {}
// };

export const getRightsByGroupid = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.get(`${IP}/api/GroupRight/${id}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const createUser = async (user2) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(token);
    const response = await axios.post(`${IP}/api/user/`, user2, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const editUser = async (user2) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // console.log(token);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.warn(">>>>");
    console.log(user);
    const response = await axios.put(`${IP}/api/user/`, user2, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const getGroups = async () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    const response = await axios.get(`${IP}/api/Groups/`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const editGroups = async (info) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    const response = await axios.put(`${IP}/api/Groups/`, info, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const deleteRights = async (info) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    console.log(user, token, info);
    const response = await axios.delete(`${IP}/api/GroupRight/`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
      data: info,
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const addRights = async (info) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    const response = await axios.post(`${IP}/api/GroupRight/`, info, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const deleteGroups = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    const response = await axios.delete(`${IP}/api/Groups/${id}`, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {}
};

export const addGroups = async (info) => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    const response = await axios.post(`${IP}/api/Groups/`, info, {
      headers: {
        User: user,
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
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
      response = await axios.get(`${IP}/statistics?stock_uid=`, {});
    else
      response = await axios.get(`${IP}/statistics?stock_uid=${stock_uid}`, {});
    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getChatGpt = async (text) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let response;
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // let vendor_id = "564aec5e-e964-11eb-8407-5800e3fc6bdd";
    response = await axios.get(`${base_url}/api/chat-gpt?text=${text}`);

    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getOrders = async (date1, date2) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let response;
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    let vendor_id = "564aec5e-e964-11eb-8407-5800e3fc6bdd";
    response = await axios.get(
      `${IP}/api/order?show=all&date1=${date1}&date2=${date2}`,
      {
        headers: {
          User: user,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const sendVCard = async (input) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let response;
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("login");
    let vendor_id = "564aec5e-e964-11eb-8407-5800e3fc6bdd";
    console.log(input.get("photo"));
    response = await axios.post(`${base_url}/api/vcard`, input);

    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const saveUpdates = async (body) => {
  try {
    let response = await axios.put(`${base_url}/api/vcard`, body);
    return response;
  } catch (e) {}
};
export const removeVCard = async (id) => {
  try {
    let response = await axios.delete(`${base_url}/api/vcard`, {
      data: { personid: id }, // Передаем id в теле запроса
    });
    return response;
  } catch (e) {}
};
export const getVCards = async (input) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let response;
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // let vendor_id = "564aec5e-e964-11eb-8407-5800e3fc6bdd";
    response = await axios.get(`${base_url}/api/vcard`);

    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getCardsView = async (input) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let response;
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // let vendor_id = "564aec5e-e964-11eb-8407-5800e3fc6bdd";
    response = await axios.get(`${base_url}/api/cardView`);

    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const getCardsViewGroup = async (input) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let response;
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // let vendor_id = "564aec5e-e964-11eb-8407-5800e3fc6bdd";
    response = await axios.get(`${base_url}/api/cardViewGroup`);

    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const fetchMessagesAPI = async (date = "") => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let response;
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // let vendor_id = "564aec5e-e964-11eb-8407-5800e3fc6bdd";
    response = await axios.get(`${base_url}/messages?date=${date}`);

    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const sendMessageAPI = async (text, id) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let response;
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // let vendor_id = "564aec5e-e964-11eb-8407-5800e3fc6bdd";
    response = await axios.post(`${base_url}/messages`, { text, author: id });

    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};

export const poll = async (lastMessageId) => {
  try {
    // const token = await axios.post(`${base_url}/api/logon`, {
    //   login: "admin",
    //   password: "11083",
    // });
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // console.log(token);
    let response;
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("login");
    // let vendor_id = "564aec5e-e964-11eb-8407-5800e3fc6bdd";
    response = await axios.get(
      `${base_url}/poll?lastMessageId=${lastMessageId}`
    );

    console.log("server API", response.data);
    return response.data;
  } catch (e) {}
};
