import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Height of the coloured bar itself, excluding the safe-area inset it sits on.
// CustomBottomBar renders at exactly this height.
export const TAB_BAR_HEIGHT = 75;

// Breathing room between the last item in a list and the tab bar.
const CONTENT_GUTTER = 16;

/**
 * Bottom padding a scrollable tab screen needs so its last item clears the
 * floating tab bar.
 *
 * This replaces `paddingBottom: '25%'`, which was wrong twice over: percentage
 * padding in React Native resolves against the parent's WIDTH, not height, so
 * the reserved space changed with device width and had no relationship to the
 * bar's actual height.
 */
export const useTabBarSpacer = () => {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + insets.bottom + CONTENT_GUTTER;
};
