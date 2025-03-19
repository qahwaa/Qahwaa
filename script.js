document.addEventListener("DOMContentLoaded", function () {
    // تحميل بيانات السلة من localStorage
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function () {
            console.log("🚀 زر Add to Cart تم الضغط عليه!");

            const product = this.closest(".product");
            if (!product) {
                console.error("❌ لم يتم العثور على العنصر الأب (product)!");
                return;
            }

            const productName = product.querySelector("h3")?.innerText || "غير معروف";
            const productImage = product.querySelector(".image-container img")?.src || "";
            const sizeSelect = product.querySelector("select[name='size']");
            const colorSelect = product.querySelector("select[name='color']");
            const productSize = sizeSelect ? sizeSelect.value : "Default";
            const productColor = colorSelect ? colorSelect.value : "Default";

            console.log("🛒 إضافة المنتج: ", productName, productSize, productColor);

            // التأكد من عدم إدخال NaN في الكمية
            let existingItem = cart.find(item => item.name === productName && item.size === productSize && item.color === productColor);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    image: productImage,
                    size: productSize,
                    color: productColor,
                    quantity: 1 // الحد الأدنى للطلب عنصر واحد
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            alert("✅ تمت إضافة المنتج إلى السلة!");
        });
    });

    function updateCartCount() {
        const cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        } else {
            console.warn("⚠️ لم يتم العثور على عنصر cart-count!");
        }
    }

    updateCartCount();

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
