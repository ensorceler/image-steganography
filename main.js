function dec2bin(dec) {
  return dec.toString(2);
}

function worker(ans) {
  let bin = dec2bin(ans);
  while (bin.length < 24) {
    bin = "0" + bin;
  }
  console.log("finally ready : ", bin);
  let red_part = parseInt(bin.slice(0, 8), 2);
  let green_part = parseInt(bin.slice(8, 16), 2);
  let blue_part = parseInt(bin.slice(16, 24), 2);
  return [red_part, green_part, blue_part];
}

function convertTextToBinary(messageInput) {
  console.log(messageInput);
  let x = "";
  for (let i = 0; i < messageInput.length; i++) {
    let str = messageInput[i].charCodeAt(0).toString(2);
    console.log(str);
    while (str.length < 8) {
      str = "0" + str;
    }
    x += str;
  }
  console.log("binary string ", x);
  console.log(x.length);
  return [x.length, x];
}

function handleImage(e) {
  var reader = new FileReader(); //creating a file reader
  reader.readAsDataURL(e.target.files[0]); //creating a data url for image

  reader.onload = function (event) {
    var img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // our special condition to check if there's actually message hidden or not
      imgData.data[4] = 16;
      imgData.data[5] = 33;
      imgData.data[6] = 74;
      imgData.data[7] = 31;

      let [messageLength, messageBinary] = convertTextToBinary(
        messageInput.value
      );
      let [red_part, green_part, blue_part] = worker(messageLength);
      console.log(red_part, green_part, blue_part);

      imgData.data[8] = red_part;
      imgData.data[9] = green_part;
      imgData.data[10] = blue_part;

      for (let i = 12, j = 0; j < messageLength; i += 4, j++) {
        // encoding the data in the last one bit of the red
        let x = imgData.data[i].toString(2);
        let y = messageBinary[j];
        new_x = x.slice(0, -1) + y; // changing the last bit of the image
        let z = parseInt(new_x, 2);
        imgData.data[i] = z;
      }

      ctx.putImageData(imgData, 0, 0);
    };
  };
}

function convertBinaryToText(str) {
  let x = "";
  for (let i = 0; i < str.length; i += 8) {
    let y = str.slice(i, i + 8);
    x += String.fromCharCode(parseInt(y, 2));
  }
  console.log("the message is : ");
  console.log(x);
  decoded_message.innerHTML = "The message is : " + x;
}

function decodeMessage(total_length, decodedimgData) {
  let output = "";
  for (let i = 12, j = 0; j < total_length; j++, i += 4) {
    let str = decodedimgData.data[i].toString(2);
    output += str[str.length - 1];
  }
  console.log("this is the message in binary : ", output);
  convertBinaryToText(output);
}

function handleDecoder(e) {
  var reader2 = new FileReader(); //creating a file reader
  reader2.readAsDataURL(e.target.files[0]); //creating a data url for image

  reader2.onload = function (event) {
    var img2 = new Image();
    img2.src = event.target.result;

    img2.onload = function () {
      decodeCanvas.width = img2.width;
      decodeCanvas.height = img2.height;
      console.log("decoded image loaded");
      dctx.drawImage(img2, 0, 0);
      const decodedimgData = dctx.getImageData(
        0,
        0,
        decodeCanvas.width,
        decodeCanvas.height
      );
      let red_part = decodedimgData.data[8].toString(2);
      let blue_part = decodedimgData.data[9].toString(2);
      let green_part = decodedimgData.data[10].toString(2);
      let total_length = parseInt(red_part + blue_part + green_part, 2);
      console.log(total_length);
      decodeMessage(total_length, decodedimgData);
    };
  };
}
//image encoder part
const fileUpload = document.querySelector("#image-upload"); // image upload
var canvas = document.getElementById("imageCanvas"); // canvas
const ctx = canvas.getContext("2d");
const messageInput = document.querySelector("#message");
fileUpload.addEventListener("change", handleImage, false);

//image decoder part
const imageDecoder = document.querySelector("#image-decode");
const decodeCanvas = document.querySelector("#decodeCanvas");

const dctx = decodeCanvas.getContext("2d");
imageDecoder.addEventListener("change", handleDecoder, false);
const decoded_message = document.querySelector("#decoded_message");
