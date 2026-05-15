document.addEventListener("DOMContentLoaded", function () {
    // ========================== تنبيه عند استخدام الوضع الرأسي ==========================
    if (window.matchMedia("(orientation: portrait)").matches) {
        alert("يفضل استخدام الموقع في الوضع الأفقي للحصول على أفضل تجربة. يرجى تدوير جهازك.");
    }

    // ========================== زر الهامبرغر (القائمة الجانبية) ==========================
    const hamburger = document.createElement("div");
    hamburger.classList.add("hamburger");
    hamburger.innerHTML = "&#9776;"; // أيقونة الهامبرغر (3 خطوط)

    const header = document.querySelector("header");
    const nav = document.querySelector(".navigation");

    if (header && nav) {
        header.insertBefore(hamburger, nav); // إضافة الزر قبل القائمة

        hamburger.addEventListener("click", function () {
            nav.classList.toggle("active"); // إظهار أو إخفاء القائمة
        });
    }

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener("click", function (event) {
        if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
            nav.classList.remove("active");
        }
    });

    

    // ========================== تحميل بيانات السلة من localStorage ==========================
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    addToCartButtons.forEach(button => {
    button.addEventListener("click", function () {

        const product = this.closest(".product");
        if (!product) return;

        const productName = product.querySelector("h3")?.innerText || "";
        const productImage = product.querySelector(".image-container img")?.src || "";

         cart = JSON.parse(localStorage.getItem("cart")) || [];

        // ================= BUNDLE =================
        if (productName.includes("Bundle")) {

            const tshirtSize =
                product.querySelector(".tshirt-size")?.value;

            const boxSize =
                product.querySelector(".box-size")?.value;

            const boxColor =
                product.querySelector(".box-color")?.value;

            const boxDesign =
                product.querySelector(".box-design")?.value;

            cart.push({
    name: "Oversized Bundle",
    image: productImage,

    size: `Oversize Tee: ${tshirtSize} | Box Tee: ${boxSize}`,

    color: `Box Color: ${boxColor} | Design: ${boxDesign}`,

    quantity: 1,
    price: 950, // ← دي المهمة
    type: "bundle"
});

        }

        // ================= NORMAL PRODUCTS =================
        else {

            const sizeSelect = product.querySelector("select[name='size']");
            const colorSelect = product.querySelector("select[name='color']");

            const productSize = sizeSelect ? sizeSelect.value : "Default";
            const productColor = colorSelect ? colorSelect.value : "Default";

            let productType = "oversize";

            if (
                productName.toLowerCase().includes("box-fit") ||
                productName.toLowerCase().includes("box fit")
            ) {
                productType = "boxfit";
            }

            cart.push({
                name: productName,
                image: productImage,
                size: productSize,
                color: productColor,
                quantity: 1,
                price: 500, // السعر الثابت لكل منتج
                type: productType
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        alert("✅ Added to cart!");
    });
});

    function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;

    cartCountElement.textContent = cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
    );
}

window.addBundleToCart = function () {
    const oversize = document.getElementById("bundle-oversize").value;
    const boxfit = document.getElementById("bundle-boxfit").value;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
    name: "Oversized Bundle",
    image: productImage,

    size: `Oversize Tee: ${tshirtSize} | Box Tee: ${boxSize}`,

    color: `Box Color: ${boxColor} | Design: ${boxDesign}`,

    quantity: 1,
    price: 950, // ← دي المهمة
    type: "bundle"
});

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("🔥 Bundle added successfully!");
};

    // ========================== تحسين تبديل الصور ==========================
    function changeImage(button, direction) {
        const container = button.closest(".image-container");
        const img = container.querySelector("img");

        if (!img) return;

        let imageList = img.getAttribute("data-images").split(",").map(img => img.trim());
        let currentSrc = img.src.split("/").pop();
        let currentIndex = imageList.findIndex(image => image.includes(currentSrc));

        if (currentIndex === -1) currentIndex = 0;

        let newIndex = (currentIndex + direction + imageList.length) % imageList.length;
        img.src = imageList[newIndex];
    }

    document.querySelectorAll(".prev, .next").forEach(button => {
        button.addEventListener("click", function () {
            let direction = this.classList.contains("prev") ? -1 : 1;
            changeImage(this, direction);
        });
    });
});
