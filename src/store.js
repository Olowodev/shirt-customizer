import { proxy } from 'valtio'

const state = proxy({
  intro: true,
  // colors: ['#ccc', '#EFBD4E', '#80C670', '#726DE8', '#EF674E', '#353934'],
  colors: ['#ccc', '#0e1f7d', '#ef0107', '#efbd4e', '#80c670', '#353934'],
  decals: ['arsenal', 'liverpool', 'chelsea', 'leicester'],
  color: '#EFBD4E',
  decal: 'chelsea'
})

export { state }
