Vue.component("products", {
    props: ['id', 'name', 'mindays', 'maxdays', 'minsumm', 'description', 'maxsumm', 'rate', 'stepdays', 'type'],
    template: `<div v-on:click="selectProduct" class="product" v-bind:class="{select_product: getCurrentProduct(id) == id, disable_product: getCurrentProduct(id) != id}">
      <p class="products_titile">{{ name }} / <span v-html="description">{{ description }}</span></p>
      <div class="products_conditions">
        <p>от {{ minsumm }} до {{ maxsumm }} рублей</p> 
        <p>от {{ mindays }} до {{ maxdays }} дней</p> 
        <p>под {{ Number(rate * 100).toFixed(2) }}% в сутки</p>
        <p v-if="type == 'PDL'">один платеж в конце срока</p>
        <p v-else-if="type == 'IL'">{{getMessagePaymentSchedule(stepdays)}}</p>
      </div>
   </div>`,
    methods: {
        selectProduct: function (event) {
            this.$parent.currentProduct = this.id

            // summ
            this.$parent.options.min = this.minsumm
            this.$parent.options.max = this.maxsumm
            this.$parent.curSumm = this.minsumm + (this.maxsumm - this.minsumm) / 2
            this.$parent.curRate = this.rate
            this.$parent.curStepDays = this.stepdays
            this.$parent.paymentType = this.type
            this.$parent.interval = this.stepsumm || 1

            // days
            this.$parent.sliderDays.options.min = this.mindays
            this.$parent.sliderDays.options.max = this.maxdays
            this.$parent.sliderDays.options.interval = this.stepdays || 1

            this.$parent.sliderDays.curDays = this.mindays + ( (this.maxdays - this.mindays) / 2)

        },
        getCurrentProduct: function (event) {
            return this.$parent.currentProduct
        },
        getMessagePaymentSchedule: function (days) {
            function num2str(n, text_forms) {
                n = Math.abs(n) % 100; var n1 = n % 10;
                if (n > 10 && n < 20) { return text_forms[2]; }
                if (n1 > 1 && n1 < 5) { return text_forms[1]; }
                if (n1 == 1) { return text_forms[0]; }
                return text_forms[2];
            }
            if (!days) return
            let weeks = days / 7;
            let msg = 'аннуитетные платежи раз в '
            if (Number.isInteger(weeks)) {
                return msg + weeks + ' ' + num2str(weeks, ['неделя', 'недели', 'недель'])
            }
            return msg + days + ' ' + num2str(days, ['день', 'дня', 'дней'])
        }
    }
})

function createProducts() {
    let vm = this;
    fetch("https://raw.githubusercontent.com/imhuman/test/master/ed.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            function getProducts(data) {
                let products = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].products && data[i].minsumm && data[i].maxsumm && data[i].stepsumm) {
                        for (let j = 0; j < data[i].products.length; j++) {
                            let product = data[i].products[j];
                            product['minsumm'] = data[i].minsumm
                            product['maxsumm'] = data[i].maxsumm
                            product['stepsumm'] = data[i].stepsumm
                            products.push(product)
                        }
                    }
                }
                return products
            }

            vm.products = getProducts(data)
            if (vm.products.length) {
                vm.currentProduct = vm.products[0].id

                // sum
                vm.options.min = vm.products[0].minsumm
                vm.options.max = vm.products[0].maxsumm
                vm.options.interval = vm.products[0].stepsumm || 1

                vm.curSumm = vm.products[0].minsumm + ( (vm.products[0].maxsumm - vm.products[0].minsumm) / 2)
                vm.curRate = vm.products[0].rate
                vm.curStepDays = vm.products[0].stepdays
                vm.paymentType = vm.products[0].type

                // days
                vm.sliderDays.options.min = vm.products[0].mindays
                vm.sliderDays.options.max = vm.products[0].maxdays
                vm.sliderDays.options.interval = vm.products[0].stepdays || 1


                vm.sliderDays.curDays = vm.products[0].mindays + ( (vm.products[0].maxdays - vm.products[0].mindays) / 2)
                // console.log('');
            }
        });
}
