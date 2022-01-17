import Numeral from 'numeral'

Numeral.register('locale', 'se', {
    delimiters: {
        thousands: ' ',
        decimal: '.'
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'g',
        trillion: 't'
    },
    ordinal : () => '.',
    currency: {
        symbol: '€'
    }
})

Numeral.locale('se')


const num = Numeral()

export const format = (value: number) => {
    num.set(value)
    return num.format('0,0')
}

export const formatShort = (value: number) => {
    num.set(value)
    return num.format('0,0a')
}