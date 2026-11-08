document.getElementById('image').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const preview = document.getElementById('preview');

  if (!file) {
    preview.style.display = 'none';
    document.getElementById('debug').innerText = "No file chosen yet";
    return;
  }

  document.getElementById('debug').innerText =
    "You chose: " + file.name + " | Size: " + Math.round(file.size / 1024) + "KB";
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

// Shrink the photo so many products fit in browser storage
function resizeImage(file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const max = 600;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("productprice").value);
  const category = document.getElementById("category").value;
  const file = document.getElementById("image").files[0];
  const message = document.getElementById("message");

  if (!name || !price || !file) {
    message.style.color = "red";
    message.innerText = "Please enter name, price and choose an image!";
    return;
  }

  resizeImage(file, function(imageData) {
    try {
      const products = JSON.parse(localStorage.getItem("abyoProducts") || "[]");
      products.push({
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        image: imageData
      });
      localStorage.setItem("abyoProducts", JSON.stringify(products));

      message.style.color = "green";
      message.innerText = "✅ Product added! Open pro.html to see it.";
      document.getElementById("debug").innerText = "Saved! Total uploaded: " + products.length;

      document.getElementById("name").value = "";
      document.getElementById("productprice").value = "";
      document.getElementById("image").value = "";
      document.getElementById("preview").style.display = "none";
    } catch (err) {
      message.style.color = "red";
      message.innerText = "Storage is full. Delete some products first.";
    }
  });
}
localStorage.clear();
