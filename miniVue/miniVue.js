class PlatziReactive {
  //dependencias
  deps = new Map()

  constructor(options) {
    this.origen = options.data();

    const self = this;

    //destino
    this.$data = new Proxy(this.origen, {
      get(target, name) {
        if (Reflect.has(target, name)) {
          self.track(target, name);
          return Reflect.get(target, name);
        }
        console.warn('La propiedad', name, 'No existe')
        return ''
      },
      set(target, name, value) {
        Reflect.set(target, name, value);
        self.trigger(name)
      }
    })
  }

  track(target, name) {
    if (!this.deps.has(name)) {
      const effect = () => {
        document.querySelectorAll(`*[a-text=${name}`).forEach( el => {
          this.aText(el, target, name)
        });
      }
      this.deps.set(name, effect)
    }
  }

  trigger(name) {
    const effect = this.deps.get(name);
    effect();
  }

  mount() {
    document.querySelectorAll('*[a-text]').forEach( elemento => {
      this.aText(elemento, this.$data, elemento.getAttribute('a-text'))
    });

    document.querySelectorAll('*[a-model]').forEach( elemento => {
      const name = elemento.getAttribute('a-model');
      this.aModel(elemento, this.$data, name)
      elemento.addEventListener('input', () => {
        Reflect.set(this.$data, name, elemento.value)
      })
    });

    document.querySelectorAll('*[p-bind]').forEach(Element => {
      let Atributo = Element.getAttribute('p-bind').split(':')[0];
      let Valor = Element.getAttribute('p-bind').split(':')[1];
      
      this.pBind(Element, this.$data, Atributo, Valor)
    })
  }

  aText(el, target, name) {
    el.innerText = Reflect.get(target, name);
  }

  aModel(el, target, name) {
    el.value = Reflect.get(target, name);
  }
  pBind(element, origin, attribute, value) {
    element.setAttribute(attribute, Reflect.get(origin, value));
  }
}

var MiniVue = {
  createApp(options) {
    return new PlatziReactive(options);
  }
};