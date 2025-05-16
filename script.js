const menu = document.getElementById("menu")
const carbtBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemscontainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const chekoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = []; //lista para o carrinho

//abrir modal cart
carbtBtn.addEventListener("click", function(){
    updateCardModal();
    cartModal.style.display = "flex"
})

//fechar modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
}
})

//fechar modal cart
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//add item no carrinho
menu.addEventListener("click", function(event){
    // cria uma variavel e o .target.closest devolve o elemento html de acordo com a condição da função
    let parentButton = event.target.closest(".add-too-card-btn")
   //se clicou no elemente que possuio a classe ".add-too-card-btn", ou alguem dentro dessa classe// 
    if(parentButton){
            const name = parentButton.getAttribute("data-name") //cria uma constante com o nome do produto
            const price = parseFloat(parentButton.getAttribute("data-price"))//o "parseFlot" converte oque o "data-price" recebe em float e cria uma constante com o preço do produto

            // chama a função para Adicionar no carrinho
            addToCart(name, price)
        }
})

//função para Adicionar no carrinho
function addToCart(name, price){
    const jaItem = cart.find(item => item.name===name) //consulta para ver se ja existe um item adicionado na lista com o name atual que foi clicado
    if(jaItem){
        jaItem.quantidade += 1;
    }else{
        cart.push({
        name,
        price,
        quantidade: 1,
});
}

// se o item ja existe aumenta apenas a quantidade + 1   

    updateCardModal()
}

//mostrar visualmente

function updateCardModal(){
    cartItemscontainer.innerHTML = "";
    let total = 0;

//forEach é um loop para percorrer a lista e fazer alguma coisa
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4" , "flex-col") 
        cartItemElement.innerHTML= `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p class=" font-medium mt-1 ">R$ ${item.price.toFixed(2)}</p>
                <p class="mb-5">Quantidade: ${item.quantidade}</p>
                
            </div>

            
            <button class="remove-item-btn" data-name="${item.name}">
             remover
            </button>
            

        </div> 
        `
        total += item.price * item.quantidade //pega o preço do item e faz vezes a quantidade

        cartItemscontainer.appendChild(cartItemElement)//adiciona o conteudo HTML na div cartItemscontainer=cart-items
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"

    });
    const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);
    cartCounter.innerHTML = totalItems; // vai na cartCounter e muda o conteudo HTML para a quantidade da items na lista cart


}

//função para remover item do carrinho
cartItemscontainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-item-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCard(name);
    }
})

function removeItemCard(name){
    const index = cart.findIndex(item => item.name === name) // busca na lista a posiçao o item.name esta se é = ao nome
    if(index !== -1){
        const item = cart[index];

        if(item.quantidade > 1){
            item.quantidade -= 1;
            updateCardModal();
            return;
        }
        cart.splice(index, 1)// remove o item da lista
        updateCardModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    //
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

//finalizar o carrinho
chekoutBtn.addEventListener("click", function(){

    const isOpen = chackOpen();
    if(!isOpen){
        Toastify({
            text: "Ops o Restautante esta fechado!",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
            }).showToast();
            
            return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar para o wpp

    const cartItems = cart.map((item) => {
        return (
             ` ${item.name} Quantidade: (${item.quantidade}) Preço: R$${item.price} |`
        )
    }).join("")
    const mensagem = encodeURIComponent(cartItems)
    const phone = ""

    window.open(`https://wa.me/${phone}?text=${mensagem} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCardModal();
})

//verificar a hora e manipular o car do horario
function chackOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora <22; //True
}

const spanItem = document.getElementById("date-span")
const isOpen = chackOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
}