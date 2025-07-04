
const green = 'bg-green-800';
const yellow = 'bg-yellow-500';
const red = 'bg-red-800';

export const getColorForCompare = (goal: number | string | string[], item:  number | string | string[]) => {
  if (!Array.isArray(item) || !Array.isArray(goal)) {
    return item == goal ? green : red
  }

  let matches = 0;

  goal.forEach((i: any) => {
    if (item.indexOf(i) >= 0) {
      matches += 1;
    }
  })

  if (matches === 0) return red;
  if (matches === goal.length) {
    if (goal.length === item.length) return green
  }
  return yellow;
}

export const getEmojiFromColor = (color: string) => {
  switch(color) {
    case green:
      return "🟩";
      break;
    case red:
      return "🟥";
      break;
    case yellow:
      return "🟨";
      break;
  }
}

export const NumericCompareIndicator = (goal: number, item:  number ) => {
  if (goal === item) return "";

  if (goal > item) {
    return " ↑";
  } else {
    return " ↓";
  }
}