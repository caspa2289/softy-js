const { Transformer } = require('@parcel/plugin')

module.exports = new Transformer({
    async transform({ asset }) {
        return [ asset ]
    }
})
