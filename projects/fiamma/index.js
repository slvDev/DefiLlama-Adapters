const { function_view } = require('../helper/chain/aptos')

const FIABTC = {
  ethereum: '0x22F0E0a4c97ff43546dad16d43Ef854C773F0e08',
  base: '0x60C230c38aF6d86b0277a98a1CAeAA345a7B061F',
  sei: '0x60C230c38aF6d86b0277a98a1CAeAA345a7B061F',
  plume_mainnet: '0x60C230c38aF6d86b0277a98a1CAeAA345a7B061F',
}

const FIABTC_APTOS = '0x75de592a7e62e6224d13763c392190fda8635ebb79c798a5e9dd0840102f3f93'

const evmTvl = target => async api => {
  const supply = await api.call({ target, abi: 'uint256:totalSupply' })
  api.addCGToken('bitcoin', supply / 1e8)
}

async function aptosTvl(api) {
  const res = await function_view({
    functionStr: '0x1::fungible_asset::supply',
    type_arguments: ['0x1::fungible_asset::Metadata'],
    args: [FIABTC_APTOS],
  })
  const supply = res?.vec?.[0] ?? '0'
  api.addCGToken('bitcoin', Number(supply) / 1e8)
}

module.exports = {
  methodology: 'Fiamma BTC TVL represents the total amount of Bitcoin bridged across all chains through the Fiamma Bridge, a trust-minimized bridge built on the BitVM2 protocol. Computed as the sum of FIABTC totalSupply on each destination chain, since FIABTC is a 1:1 wrapped BTC.',
  aptos: { tvl: aptosTvl },
}

Object.keys(FIABTC).forEach(chain => {
  module.exports[chain] = { tvl: evmTvl(FIABTC[chain]) }
})
