chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.method == "getData"){
            var myObj = new Object();
            myObj['price'] = $("#J_priceStd strong span").text();
            myObj['img'] = $("#J_ThumbView").attr('src');
            myObj['discount_price'] = $("#J_PromoPrice strong").text().substring(1);
            myObj['delivery_price'] = $("#J_WlServiceTitle").text().substring(4);
            if(parseInt(myObj['delivery_price'], 10) == "NaN") {
              myObj['delivery_price'] = undefined;
            }
            myObj['img'] = myObj['img'];

            sendResponse({data: myObj, method: "getData"}); //same as innerText
        }
    }
);
