/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable @typescript-eslint/naming-convention */
export enum HelpLevelType {
  SUPPORT = 'SUPPORT',
  HELP = 'HELP',
  URGENT = 'URGENT',
}

export const HelpLevelValue = {
  [HelpLevelType.SUPPORT]: 1000000,
  [HelpLevelType.HELP]: 1500000,
  [HelpLevelType.URGENT]: 2000000,
};
