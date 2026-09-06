// Page-level analytics events.
//
// The cart already fires add_to_cart and remove_from_cart from useCart, and
// checkout fires begin_checkout. This covers the events that belong to a page
// rather than an interaction: the view itself, and the two commerce views that
// funnels are usually built on.
//
// Nothing is transmitted until consent is granted; see src/lib/analytics.ts.

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, readUtm } from "@/lib/analytics";

export const PageViewTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    const utm = readUtm(window.location.search);
    track({ name: "page_view", path: pathname });
    if (Object.keys(utm).length > 0) {
      // Campaign parameters are kept for the session so a purchase later in
      // the visit can still be attributed to the click that started it.
      try {
        sessionStorage.setItem("glow-utm", JSON.stringify(utm));
      } catch {
        // Private browsing and blocked storage are not worth failing over.
      }
    }
  }, [pathname]);

  return null;
};

export const ViewItemTracker = ({
  id,
  item,
  value,
}: {
  id: string;
  item: string;
  value: number;
}) => {
  useEffect(() => {
    track({ name: "view_item", id, item, value });
  }, [id, item, value]);
  return null;
};

export const ViewCartTracker = ({
  value,
  items,
}: {
  value: number;
  items: number;
}) => {
  useEffect(() => {
    if (items > 0) track({ name: "view_cart", value, items });
    // Only the arrival matters, not every quantity change while browsing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};
