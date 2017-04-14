$(document).ready(function(){
  $('#btn_submit').click(function(e){
    chrome.tabs.executeScript(null, {file: "content.js"});

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.executeScript(tab.Id, {file: "jquery.js"});
        chrome.tabs.sendMessage(tab.id, {method: "getData"}, function(response) {
            if(response.method=="getData") {
                data = response.data;
                data['url'] = tab.url;
                run(data, this);
            }
        });
    });



    function run (data, link2) {
      if (data["img"] != "" && data["img"] != undefined) {

        if (data["img"].substring(4,0) != "http") {
          data["img"] = "https:" + data["img"];
        }

        var finalPrice = 0;
        if(!isNaN(data["discount_price"]) && data["discount_price"] != "") {
          finalPrice = parseInt(data["discount_price"],10);
        } else {
          finalPrice = parseInt(data["price"],10);
        }

        delivery_price = parseInt(data["delivery_price"],10);
        if(!isNaN(delivery_price)) {
          finalPrice = finalPrice + delivery_price;
        }

        markup = 2;
        if(finalPrice < 71) {
          markup = 1.39;
        } else if (finalPrice > 70 && finalPrice < 151 ) {
          markup = 1.36;
        } else if (finalPrice > 150 && finalPrice < 201 ) {
          markup = 1.28;
        } else if (finalPrice > 200 && finalPrice < 251 ) {
          markup = 1.25;
        } else if (finalPrice > 250 && finalPrice < 301 ) {
          markup = 1.22;
        } else if (finalPrice > 300 && finalPrice < 401 ) {
          markup = 1.20;
        } else if (finalPrice > 400 && finalPrice < 601 ) {
          markup = 1.19;
        } else if (finalPrice > 600 && finalPrice < 1001 ) {
          markup = 1.17;
        } else if (finalPrice > 1000) {
          markup = 1.15;
        }

        course = $("#course").val();
        finalPrice = (finalPrice * course) * markup;

        weight = parseFloat($("#weight").val().replace(",","."));
        weight = weight * 0.001; // умножение на граммы к килограммам
        priceDelivery = parseFloat($("#priceDelivery").val().replace(",","."));
        finalPrice =  parseInt((finalPrice + (weight * priceDelivery)),10);

        //finalPrice = Math.round((finalPrice/100) ) * 100; // округление до сотых, может работать и в - например 2049 -> 2000

        extension = data["img"].slice(-4); //".jpg";

        var id = "";
        var urls = "";

        var getLocation = function(href) {
          var l = document.createElement("a");
          l.href = href;
          return l;
        };

        path = getLocation(data['url']).pathname.split("/");
        id = path[2].split(".");
        iid = parseInt(id[0],10);
        var id8 = iid.toString(8);

        /* FOR DEBUG
        var imageObj=new Image();
        imageObj.src=data["img"];//'http://javascript.ru/files/u20687/7_1.jpg';
        var oCanvas = document.getElementById("cnv");
        var context = cnv.getContext("2d");
        //oCanvas = document.createElement('canvas');
        oCanvas.height = imageObj.height;
        oCanvas.width = imageObj.width;
        var context = oCanvas.getContext("2d");
        context.width = imageObj.width;
        context.height = imageObj.height;
        context.drawImage(imageObj, 0, 0);
        context.fillStyle = "white";
        context.font = "40pt Calibri";
        context.textAlign="center";
        context.fillText(finalPrice + " руб.", context.width/2, (context.height / 10 ) * 9);
        */

        var val = "";
        // console.log(data["img"], finalPrice, id8);
        val = createImage(data["img"], finalPrice, id8);
        var tempval = "-1";

      } else {
        console.log('ОШИБКА!');
        $("#result").text('ОШИБКА!');
      }


      var it = 0;
      chrome.alarms.onAlarm.addListener(
        function (alarm) {
          it = it + 1;
          if(val === tempval) {
            if(val == "data:,") {
              // console.log('return!');
              //console.log(data["img"]);
              val = createImage(data["img"], finalPrice, id8);
              return;
            }
            chrome.alarms.clearAll();
            chrome.downloads.download({url: val, filename: "tao/"+id8 + "_" + finalPrice + ".png", saveAs: false});
            console.log("ЗАГРУЖЕНО!");
            $("#result").text('ЗАГРУЖЕНО!');
          } else {
            if(it > 15) {
              chrome.alarms.clearAll();
              console.log("ERROR: timeOut!");
              $("#result").text('ОШИБКА: timeOut!');
            }
            tempval = val;
          }
        }
      );

      chrome.alarms.create("alarm",
        {
          delayInMinutes: 0.03,
          periodInMinutes: 0.03
        }
      );

    }

    function createImage(imgurl, price, id8) {
      // console.log(id8);
      var imageObj=new Image();
      imageObj.src=imgurl;
      var cnv = document.getElementById("cnv");
      var context = cnv.getContext("2d");
      oCanvas = document.createElement('canvas');
      oCanvas.height = imageObj.height;
      oCanvas.width = imageObj.width;
      var context = oCanvas.getContext("2d");
      context.width = imageObj.width;
      context.height = imageObj.height;
      context.drawImage(imageObj, 0, 0);
      context.shadowColor = "white";
      context.shadowOffsetX = 1;
      context.shadowOffsetY = 1;
      context.shadowBlur = 2;
      context.fillStyle = "black";
      context.font = "15pt DejaVu Serif";
      context.textAlign="center";
      // context.fillText(price, context.width/2, (context.height / 10 ) * 9);

      context.shadowOffsetX = 1;
      context.shadowOffsetY = 1;
      context.fillText(String(id8) + "  " + price, 140, (context.height / 10 ) );

      return oCanvas.toDataURL();
    }

  });
});
