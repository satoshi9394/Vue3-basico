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
      <p class="description__status" 
        v-if="product.stock === 3"
      > 
        Quedan pocas unidades!
      </p>
      <p class="description__status"
        v-else-if="product.stock === 2"
      > 
        El producto esta por terminarse!
      </p>
      <p class="description__status" 
        v-else-if="product.stock === 1"
      >
        Ultima unidad disponible
      </p>
      <p class="description__price"
        :style="{ color: price_color }"
      > 
        $ {{ new Intl.NumberFormat('es-MX').format(product.price) }} 
      </p>
      <p class="description__content"> 
        {{product.content }} 
      </p>
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
      activeImages: 0,
      price_color: computed( () => {
        const colorRojo = "rgb(104, 104, 209)";
        const colorAzul = "rgb(188, 30, 67)";
        const isLessThanTwo = product.stock <= 1;
        return isLessThanTwo ? colorAzul : colorRojo;
      })
      // price_color: "rgb(104, 104, 209)"
    });
    
    /* una forma de hacerlo 
    const price_color = computed( () => {
      const colorRojo = "rgb(104, 104, 209)";
      const colorAzul = "rgb(188, 30, 67)";
      const isLessThanTwo = product.stock <= 1;
      return isLessThanTwo ? colorAzul : colorRojo;
    });
    */

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
    // necesita una referencia y no una propiedad reactiva por lo que se necesita crear para el watch 
    // esta rejecucion de la propiedad
    watch( () => productState.activeImages, 
      (val, oldVal) => {
        console.log(`valor actual: ${val}, valor antiguo: ${oldVal}`);
    });
    /*
    watch( () => product.stock, 
      (stock) => {
        if ( stock <= 1 ) {
          productState.price_color = "rgb( 188, 30, 67)"
        }
      }
    )*/

    return {
      ...toRefs(productState),
      // price_color,
      sendToCart,
      applyDiscount
    }
  }
})