export const getColorForCompare = (goal: any, item: any) => {
  if (!Array.isArray(item)) {
    return item == goal ? 'bg-green-800' : 'bg-red-800'
  }

  let matches = 0;

  goal.forEach((i: any) => {
    if (item.indexOf(i) >= 0) {
      matches += 1;
    }
  })

  if (matches === 0) return 'bg-red-800';
  if (matches === goal.length) {
    if (goal.length === item.length) return 'bg-green-800'
  }
  return 'bg-yellow-500'
}