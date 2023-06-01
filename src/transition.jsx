import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { UNSAFE_useRouteId, useMatches, useOutlet } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);
  return mounted;
}

export function OverlapTransition({ key_, data, children }) {
  const mounted = useMounted();
  const [all, setAll] = useState(() => new Map());
  const delete_ = useCallback(
    function f() {
      setAll((all) => {
        if (all.get(key_)?.delete === f) {
          all = new Map(all);
          all.delete(key_);
        }
        return all;
      });
    },
    [key_],
  );
  all.set(key_, { data, delete: delete_ });
  return [...all.entries()].map(([k, v]) => (
    <Fragment key={k}>
      {children(
        v.data,
        k !== key_ ? "exit" : mounted ? "enter" : "appear",
        v.delete,
      )}
    </Fragment>
  ));
}

export function OutletCssTransition({ classNames, timeout, children }) {
  const matches = useMatches();
  const routeId = UNSAFE_useRouteId();
  const i = matches.findIndex((match) => match.id === routeId);
  const match = matches[i + 1];
  const key = match?.id;
  return (
    <OverlapTransition key_={key} data={match}>
      {(match, state, remove) => (
        <OutletCssTransitionItem
          classNames={classNames}
          state={state}
          timeout={timeout}
          match={match}
          remove={remove}
        >
          {children}
        </OutletCssTransitionItem>
      )}
    </OverlapTransition>
  );
}

function OutletCssTransitionItem({
  classNames,
  match,
  state,
  timeout,
  remove,
  children,
}) {
  const mounted = useMounted();

  let outlet = useOutlet();
  const outletRef = useRef();
  if (state === "exit") {
    outlet = outletRef.current;
  } else {
    outletRef.current = outlet;
  }

  const nodeRef = useRef();

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={state === "appear" || (mounted && state === "enter")}
      classNames={classNames}
      onExited={remove}
      timeout={timeout}
    >
      {children(nodeRef, outlet)}
    </CSSTransition>
  );
}
