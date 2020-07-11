Vue.component('loan_period', {
    props: ['mindays', 'maxdays'],
    template: `<h3>Срок ({{ getMessageLoanPeriod(mindays) }} - {{ getMessageLoanPeriod(maxdays) }})</h3>`,
    methods: {
        getMessageLoanPeriod: function (days) {
            function num2str(n, text_forms) {
                n = Math.abs(n) % 100; var n1 = n % 10;
                if (n > 10 && n < 20) { return text_forms[2]; }
                if (n1 > 1 && n1 < 5) { return text_forms[1]; }
                if (n1 == 1) { return text_forms[0]; }
                return text_forms[2];
            }
            if (!days) return
            let weeks = days / 7;
            let msg = ''
            if (Number.isInteger(weeks)) {
                return msg + weeks + ' ' + num2str(weeks, ['неделя', 'недели', 'недель'])
            }
            return msg + days + ' ' + num2str(days, ['дня', 'день', 'дней'])
        }
    }
})