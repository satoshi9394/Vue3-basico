app.component('product', {
  template: /*vue-html*/`
    <section class="product">
      <div class="product__thumbnails">
        <div 
          v-for="(image, index) in product.images"
          :key="image.thumbnail"
          class="thumb" 
          :class="{ active: activeImages === index }" 
          :style="{ backgroundImage: 'url(' + product.images[index].thumbnail + ')'}"
          @click="activeImages = index"
        ></div>
      </div>
      <div class="product__image">
        <img :src="product.images[activeImages].image" :alt="product.name">
      </div>
    </section>
    <section class="description">
      <h4>{{ product.name.toUpperCase() }} {{ product.stock === 0 ? "😢" : "😎" }}</h4>
      <badge :product="product"></badge>
      <p class="description__status" v-if="product.stock === 3"> Quedan pocas unidades!</p>
      <p class="description__status" v-else-if="product.stock === 2"> El producto esta por terminarse!</p>
      <p class="description__status" v-else-if="product.stock === 1">Ultima unidad disponible</p>
      <p class="description__price"> $ {{ new Intl.NumberFormat('es-MX').format(product.price) }} </p>
      <p class="description__content"> {{product.content }} </p>
      <div class="discount">
        <span>Codigo de Descuento</span>
        <input 
          type="text" 
          placeholder="Ingresa tu codigo" 
          @keyup.enter="applyDiscount($event)" 
        >
      </div>
      <button 
        :disabled="product.stock === 0" 
        @click="sendToCart()"
      >
        Agregar al carrito
      </button>
    </section>
  `,
  props: ['product'],
  emits: ['sendtocart'],
  setup(props, { emit }) {
    const { product } = props;

    const productState = reactive({
      activeImages: 0
    });

    const discountCodes = ref(['platzi20', 'iosamuel']);
    function applyDiscount(event) {
      const disconuntIndex = discountCodes.value.indexOf(event.target.value);
      if(disconuntIndex >= 0) {
        product.price *= 50 / 100
        discountCodes.value.splice(disconuntIndex, 1);
      }
    }

    function sendToCart() {
      emit('sendtocart', product)
    }

    return {
      ...toRefs(productState),
      sendToCart,
      applyDiscount
    }
  }
})