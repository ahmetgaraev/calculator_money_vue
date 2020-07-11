let app = new Vue({
    el: "#app",
    data() {
        return {
            products: [],
            payment_schedule: [],
            currentProduct: 0,
            curSumm: 0,
            curRate: 0,
            curStepDays: 0,
            selectDays: 0,
            paymentType: '',
            paymentAmount: 0,
            lastDatePayment: '',
            countPayments: 1,
            options: {
                dotSize: 14,
                width: '95%',
                height: 4,
                contained: false,
                direction: 'ltr',
                data: null,
                min: 0,
                max: 100,
                interval: 1,
                disabled: false,
                clickable: true,
                duration: 0.5,
                adsorb: false,
                lazy: false,
                tooltip: 'active',
                tooltipPlacement: 'top',
                tooltipFormatter: void 0,
                useKeyboard: false,
                keydownHook: null,
                dragOnClick: false,
                enableCross: true,
                fixed: false,
                minRange: void 0,
                maxRange: void 0,
                order: true,
                marks: false,
                dotOptions: void 0,
                process: true,
                dotStyle: void 0,
                railStyle: void 0,
                processStyle: void 0,
                tooltipStyle: void 0,
                stepStyle: void 0,
                stepActiveStyle: void 0,
                labelStyle: void 0,
                labelActiveStyle: void 0,
            },
            sliderDays: {
                curDays: 1,
                options: {
                    dotSize: 14,
                    width: '95%',
                    height: 4,
                    contained: false,
                    direction: 'ltr',
                    data: null,
                    min: 0,
                    max: 100,
                    interval: 1,
                    disabled: false,
                    clickable: true,
                    duration: 0.5,
                    adsorb: false,
                    lazy: false,
                    tooltip: 'active',
                    tooltipPlacement: 'top',
                    tooltipFormatter: void 0,
                    useKeyboard: false,
                    keydownHook: null,
                    dragOnClick: false,
                    enableCross: true,
                    fixed: false,
                    minRange: void 0,
                    maxRange: void 0,
                    order: true,
                    marks: false,
                    dotOptions: void 0,
                    process: true,
                    dotStyle: void 0,
                    railStyle: void 0,
                    processStyle: void 0,
                    tooltipStyle: void 0,
                    stepStyle: void 0,
                    stepActiveStyle: void 0,
                    labelStyle: void 0,
                    labelActiveStyle: void 0,
                }
            }
        }
    },
    created: function () {
        createProducts.call(this)
    },
    methods: {
        getLoadPeriod: function (days) {
            if (!days) return
            let weeks = days / 7;
            let msg = ''
            this.selectDays = days;
            this.updatePaymentSchedule()

            if (Number.isInteger(weeks)) {
                return msg + weeks + ' ' + num2str(weeks, ['неделю', 'недели', 'недель'])
            }
            return msg + days + ' ' + num2str(days, ['день', 'дня', 'дней'])
        },
        getRefundPayments() {
            return this.countPayments + ' ' + num2str(this.countPayments, ['платеж', 'платеж', 'платежей'])
        },
        getAmountPayment() {
            return getNumberWithSpaces(this.paymentAmount.toFixed(2)) + ' ' + num2str(this.paymentAmount.toFixed(2), ['рубля', 'рубля', 'рублей'])
        },
        getNameEvery() {
            if (this.paymentType == 'IL') {
                return 'каждые'
            }
            return ''
        },
        getLastDatePayment() {
            return this.lastDatePayment
        },
        getIntervalPayments: function () {
            let weeks = this.curStepDays / 7;
            let payPeriod;

            if (Number.isInteger(weeks)) {
                payPeriod =  weeks + ' ' + num2str(weeks, ['неделю', 'недели', 'недель'])
            } else {
                payPeriod = this.curStepDays + ' ' + num2str(this.curStepDays, ['день', 'дня', 'дней'])
            }
            return payPeriod
        },
        updatePaymentSchedule: function() {
            if (this.paymentType == 'PDL') {
                let rate = this.curRate * this.curStepDays
                this.paymentAmount = this.curSumm * ( (rate * Math.pow( (1 + rate), 1) ) / (Math.pow((1 + rate), 1) - 1 ) )
                let totalPaymentAmount = this.curSumm * Math.pow(1 + this.curRate, this.selectDays)

                let now = new Date()
                let datePayment = timestampToDate( now.setDate( now.getDate() + this.selectDays ) )
                this.lastDatePayment = datePayment;

                let paymentSchedule = [
                    {
                        date: datePayment,
                        amount: getNumberWithSpaces(totalPaymentAmount.toFixed(2)),
                        remains: 0
                    }
                ]

                if ( JSON.stringify(this.payment_schedule) != JSON.stringify(paymentSchedule) ) {
                    this.payment_schedule = paymentSchedule
                }
            }
            if (this.paymentType == 'IL') {
                let remainingDebt = this.curSumm;
                this.countPayments = Math.ceil(this.selectDays/this.curStepDays)
                let rate = this.curRate * this.curStepDays
                this.paymentAmount = this.curSumm * ( (rate * Math.pow( (1 + rate),this. countPayments) ) / (Math.pow((1 + rate), this.countPayments) - 1 ) )
                
                let paymentSchedule = []
                
                for (let i = 0; i < this.countPayments; i++) {
                    // console.log(' ');
                    let now = new Date()
                    let datePayment = timestampToDate( now.setDate( now.getDate() + (i + 1) * this.curStepDays ) )
                    let paymentPercent = remainingDebt * rate
                    let paymentDebt = this.paymentAmount - paymentPercent
                    remainingDebt = remainingDebt - paymentDebt

                    let remains = (Number(remainingDebt).toFixed(2))
                    if ((i + 1) == this.countPayments) {
                        this.lastDatePayment = datePayment;
                        remains = Math.abs(Math.trunc(remains))
                    }

                    let item = {
                        date: datePayment,
                        amount: getNumberWithSpaces(this.paymentAmount.toFixed(2)),
                        remains: getNumberWithSpaces(remains)
                    }
                    paymentSchedule.push(item)
                }

                if ( JSON.stringify(this.payment_schedule) != JSON.stringify(paymentSchedule) ) {
                    this.payment_schedule = paymentSchedule
                }
            }
        }
    },
    components: {
        'vueSlider': window['vue-slider-component'],
    }
});

// methods
function num2str(n, text_forms) {
    n = Math.abs(n) % 100; var n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
}

function timestampToDate(ts) {
    const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноябрая", "декабря"];

    let d = new Date();

    d.setTime(ts);
    return (String(d.getDate())).slice(-2) + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
}

function getNumberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}