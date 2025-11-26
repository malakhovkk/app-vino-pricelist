import { useEffect, useState } from "react";
import useStore from "../../zustand";
import { getContacts, getVendors } from "../../new_api";
import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import SelectBox from "devextreme-react/select-box";
import TextBox, { TextBoxTypes } from "devextreme-react/text-box";
import { GetStocks } from "../../new_api";
import { combine } from "zustand/middleware";
import { sendEmail } from "../../new_api";
import Button from "devextreme-react/button";
export default function EmailpopUp({
  vendorId,
  orderId,
  number,
  shopId,
  checkbox,
  setIsIEmailSave,
}) {
  const [contact, setContact] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendors, setVendors] = useState();
  useEffect(() => {
    (async function () {
      const cs = await getContacts(vendorId);
      setContact(cs);
      const sh = await GetStocks();
      setShops(sh);
      const vendors = await getVendors();
      setVendors(vendors);
      setVendorName(vendors.find((el) => el.id === vendorId).name);
      console.warn("??? ", cs);
      console.log("123 ", orderId);
    })();
  }, []);
  const [curContact, setCurContact] = useState();
  const [allcontacts, setAllcontacts] = useState();
  const [shops, setShops] = useState();
  const [shop, setShop] = useState(shopId);
  const [comment, setComment] = useState();
  const [check, setCheck] = useState(checkbox);

  const send = () => {
    console.log(">>> ", vendors, shop);
    const shopId = shops.find((el) => el.name === shop).id;
    sendEmail({ orderId, EmailList: allcontacts, shopId });
    setIsIEmailSave(false);
  };
  // alert(checkbox);
  return (
    <>
      {
        <Popup
          visible={true}
          showCloseButton={true}
          onHiding={() => setIsIEmailSave(false)}
          width={500}
          height={500}
          title={`Контакты для корзины`}
        >
          <div>Номер:</div>
          <div>
            <b>{number}</b>
          </div>
          <div>Поставщик:</div>
          <div>
            <b>{vendorName}</b>
          </div>
          <div>Магазин/склад:</div>
          <div>
            <SelectBox
              items={shops && shops.map((el) => el.name)}
              // defaultValue={shops && shops[0].name}
              value={shop}
              onValueChanged={(e) => {
                setShop(e.value);
              }}
            />
          </div>
          <div>Контакт:</div>
          <div>
            <SelectBox
              items={contact && contact.map((el) => el.contact)}
              // value={contact && contact[0].name}
              onValueChanged={(e) => {
                setCurContact(e.value);
                if (allcontacts) setAllcontacts(allcontacts + ", " + e.value);
                else setAllcontacts(e.value);
              }}
            />
          </div>
          <div>Введите список электронных адресов:</div>
          <div>
            <TextBox
              value={allcontacts}
              onValueChanged={(e) => {
                setAllcontacts(e.value);
              }}
              // value={addInfo}
              // onValueChanged={(e) => setAddInfo(e.value)}
            />
          </div>
          <div>Коммментарий:</div>
          <div>
            <TextBox
              value={comment}
              onValueChanged={(e) => {
                setComment(e.value);
              }}
              // value={addInfo}
              // onValueChanged={(e) => setAddInfo(e.value)}
            />
          </div>
          <Button text="Отправить" onClick={send} />
        </Popup>
      }
      {/* {orderId} {contact?.map((el) => el.name)} */}
    </>
  );
}
