const API_URL = "https://script.google.com/macros/s/AKfycbwPjl-aVAejctTmQaIK7AppNwF0d8JAT1__G83URzFzFGQtSSZZ7rWtdEJP5sRoTFQQ/exec";
const buttons = document.querySelectorAll(".status-btn");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        // เอา active ออกจากทุกปุ่ม
        buttons.forEach(btn => btn.classList.remove("active"));

        // ใส่ active ให้ปุ่มที่กด
        button.classList.add("active");

    });

});
const popup = document.getElementById("finishPopup");
const saveFinish = document.getElementById("saveFinish");

const cancelPopup = document.getElementById("cancelPopup");

buttons.forEach(button=>{

button.addEventListener("click",()=>{

if(button.classList.contains("finish")){

popup.classList.add("show");

}

});

});

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

    }catch(err){

        console.log(err);

    }

}
loadRunningOrder();