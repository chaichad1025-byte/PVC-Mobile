const API_URL = "https://script.google.com/macros/s/AKfycbwPjl-aVAejctTmQaIK7AppNwF0d8JAT1__G83URzFzFGQtSSZZ7rWtdEJP5sRoTFQQ/exec";
const buttons = document.querySelectorAll(".status-btn");

buttons.forEach(button=>{

    button.addEventListener("click",()=>{

        buttons.forEach(btn=>btn.classList.remove("active"));

        button.classList.add("active");

        if(button.classList.contains("finish")){

            popup.classList.add("show");
            return;

        }

        const status = button.dataset.status;

          selectedStatus = status;

          // ถ้าเป็นกำลังดำเนินงาน ให้ส่งทันที
          if(status==="กำลังดำเนินงาน"){

         updateStatus(status,"");
         return;

        }

// ถ้าเป็น Finish ใช้ Popup Finish
if(button.classList.contains("finish")){

    popup.classList.add("show");
    return;

}

// สถานะอื่นเปิด Popup หมายเหตุ
popupStatus.value = status;

statusRemark.value = "";

statusPopup.classList.add("show");

    });

});
const popup = document.getElementById("finishPopup");
const statusPopup = document.getElementById("statusPopup");

const popupStatus = document.getElementById("popupStatus");

const statusRemark = document.getElementById("statusRemark");

const saveStatus = document.getElementById("saveStatus");

const cancelStatusPopup = document.getElementById("cancelStatusPopup");

const closeStatusPopup = document.getElementById("closeStatusPopup");

let selectedStatus = "";
const saveFinish = document.getElementById("saveFinish");

const cancelPopup = document.getElementById("cancelPopup");



cancelPopup.onclick=()=>{

popup.classList.remove("show");

}
const orderKg = document.getElementById("orderKg");
const powderKg = document.getElementById("powderKg");
const scarpKg = document.getElementById("scarpKg");

const powderRate = document.getElementById("powderRate");
const scarpRate = document.getElementById("scarpRate");
const lump = document.getElementById("lump");
const closePopup=document.getElementById("closePopup");

closePopup.onclick=()=>{

popup.classList.remove("show");

}
closeStatusPopup.onclick = () => {

    statusPopup.classList.remove("show");

}

cancelStatusPopup.onclick = () => {

    statusPopup.classList.remove("show");

}

function calculateRate(){

    const order = parseFloat(orderKg.value) || 0;
    const powder = parseFloat(powderKg.value) || 0;
    const scarp = parseFloat(scarpKg.value) || 0;

    if(order>0){

        powderRate.value=((powder/order)*100).toFixed(2)+" %";

        scarpRate.value=((scarp/order)*100).toFixed(2)+" %";

    }else{

        powderRate.value="";

        scarpRate.value="";

    }

}

orderKg.addEventListener("input",calculateRate);

powderKg.addEventListener("input",calculateRate);

scarpKg.addEventListener("input",calculateRate);
saveFinish.addEventListener("click", async ()=>{

    if(
        orderKg.value==="" ||
        powderKg.value==="" ||
        scarpKg.value==="" ||
        lump.value===""
    ){

        alert("กรุณากรอกข้อมูลให้ครบ");
        return;

    }

    try{

        const res = await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"finishOrder",

                workNo:document.getElementById("workNo").innerText,

                orderKg:Number(orderKg.value),

                powderKg:Number(powderKg.value),

                scarpKg:Number(scarpKg.value),

                lump:Number(lump.value)

            })

        });

        const result = await res.json();

        if(result.success){

            popup.classList.remove("show");

            alert("บันทึกสำเร็จ");

            loadRunningOrder();

        }else{

            alert(result.message);

        }

    }catch(err){

        alert(err);

    }

});
popup.addEventListener("click",(e)=>{

if(e.target===popup){

popup.classList.remove("show");

}

});
async function loadRunningOrder(){

    try{

        const res = await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"getRunningOrder"

            })

        });

        const data = await res.json();

        if(!data.success){

            return;

        }

        document.getElementById("orderNo").innerText = data.orderNo;
        document.getElementById("workNo").innerText = data.workNo;
        document.getElementById("customer").innerText = data.customer;
        document.getElementById("status").innerText = data.status;
        document.getElementById("forecast").innerText = data.forecast;
        document.getElementById("worker").innerText = data.worker;

document.getElementById("sheetType").innerText = data.sheetType;

document.getElementById("fabricNo").innerText = data.fabric;

document.getElementById("color").innerText = data.color;

document.getElementById("thickness").innerText =
    data.thickness + " mm";

document.getElementById("width").innerText =
    data.width + " นิ้ว";

document.getElementById("weight").innerText =
    data.gsm + " g/m²";

document.getElementById("length").innerText =
    data.length + " " + data.unit;

document.getElementById("speed").innerText =
    data.speed + " เมตร/นาที";

document.getElementById("startDate").innerText =
    formatDate(data.startDate);

document.getElementById("dueDate").innerText =
    formatDate(data.dueDate);

document.getElementById("currentStatusText").innerText =
    data.status;

    }catch(err){

        console.log(err);

    }

}
loadRunningOrder();
function formatDate(dateString){

    if(!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleString("th-TH",{
        day:"2-digit",
        month:"long",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit"
    });

}
async function updateStatus(status,remark){

    try{

        const res = await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

              action:"updateStatus",

              workNo:document.getElementById("workNo").innerText,

              status:status,

              remark:remark

            })

        });

        const result = await res.json();

        if(result.success){

            document.getElementById("currentStatusText").innerText = status;
            document.getElementById("status").innerText = status;

            loadRunningOrder();

        }else{

            alert(result.message);

        }

    }catch(err){

        console.error(err);
        alert("อัปเดตสถานะไม่สำเร็จ");

    }

}
saveStatus.onclick = ()=>{

    updateStatus(

        selectedStatus,

        statusRemark.value

    );

    statusPopup.classList.remove("show");

}
