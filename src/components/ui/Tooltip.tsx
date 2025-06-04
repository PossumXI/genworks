import React from 'react';
import {
  useFloating,
  useInteractions,
  useHover,
  useRole,
  useDismiss,
  useClick,
  FloatingPortal,
  arrow,
  offset,
  flip,
  shift,
  FloatingArrow,
} from '@floating-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  trigger = 'hover',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const arrowRef = React.useRef(null);

  const {
    x,
    y,
    refs,
    strategy,
    context,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
  } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(8),
      flip(),
      shift(),
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(context, { enabled: trigger === 'hover' });
  const click = useClick(context, { enabled: trigger === 'click' });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              className="z-50"
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              {...getFloatingProps()}
            >
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
                {content}
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  className="fill-gray-900"
                  tipRadius={2}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};