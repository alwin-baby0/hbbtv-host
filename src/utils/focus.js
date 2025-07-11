import Lightning from '@lightningjs/sdk/src/Lightning';
import HorizontalContainer from '../components/HorizontalContainer/HorizontalContainer';
import VerticalContainer from '../components/VerticalContainer/VerticalContainer';
import { clamp } from '.';

export const getClosestElementIndexEPG = (container, target) => {
  if (!container) return 0;
  const elements = container.Items;
  // We can use target point to do the calculations
  // Math.min stops selection of offscreen items
  const targetMiddlePoint = clamp(target.finalX + target.finalW / 2, 0, container.finalW - container._scrollPosition)

  let i = 0;
  let closestIndex = -1;
  const isCurrentProgramLive = isProgramLive(target._props.startTime, target._props.endTime)
  for (; i <= elements.children.length - 1; i++) {
    const item = elements.children[i];

    // if prev channel is live prioritize it CANCCHECK FROM TARGET!
    if (isCurrentProgramLive) {
      if (
        isProgramLive(item._props.startTime, item._props.endTime) &&
        item.finalX < container.finalW - container._scrollPosition
      ) {
        return i;
      }
    }
    // checking if targets middle point is between start and end of items x axis
    if (closestIndex < 0 && targetMiddlePoint <= item.finalX + item.finalW) {
      closestIndex = i;
    }
  }

  return Math.max(closestIndex, 0);
};


/**
 * Finds closest element to target in a container
 * @param {HorizontalContainer | VerticalContainer} container - container to find index of closest item
 * @param {Lightning.Element} target - reference item
 * @returns {number} - index of closest element from the container to reference element
 */
export const getClosestElementIndex = (container, target) => {
  const elements = container.Items;
  const currentPos = target ? getElementPosition(target) : [0, 0];

  let shortestDistance = Number.POSITIVE_INFINITY;
  let closestElementIndex = 0;

  for (let index = 0; index < elements.children.length; index++) {
    const item = elements.children[index];
    if (!isElementInsideContainersVisibleArea(container, item)) continue;

    const itemPos = getElementPosition(item);
    const distance = calculateDistance(currentPos[0], currentPos[1], itemPos[0], itemPos[1]);

    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestElementIndex = index;
    }
  }

  return closestElementIndex;
};

/**
 * Finds if item in a container is visible currently
 * @param {HorizontalContainer | VerticalContainer} container - container
 * @param {Lightning.Element} item - reference item
 * @returns {boolean}
 */
const isElementInsideContainersVisibleArea = (container, item) => {
  const elements = container.Items;
  if (container.flex?.direction === 'column') {
    if (
      (item.finalY + elements.finalY < 0 ||
        item.finalY + item.finalH + elements.finalY > container.finalH) &&
      !(
        item.finalY + elements.finalY <= 0 &&
        item.finalY + item.finalH + elements.finalY >= container.finalH
      )
    ) {
      return false;
    }
  } else if (
    (item.finalX + elements.finalX < 0 ||
      item.finalX + item.finalW + elements.finalX > container.finalW) &&
    !(
      item.finalX + elements.finalX <= 0 &&
      item.finalX + item.finalW + elements.finalX >= container.finalW
    )
  ) {
    return false;
  }

  return true;
};

/**
 * Calculates coordinates of middle point of an Lightning Element
 * @param {Lightning.Element} element - lightning component
 * @returns {number} - middle point of en element
 */
const getElementPosition = (element) => {
  const [elementX, elementY] = element.core.getAbsoluteCoords(0, 0);
  const elementW = element.finalW;
  const elementH = element.finalW;

  const middle = [elementX + elementW / 2, elementY + elementH / 2];

  return middle;
};

/**
 * Calculates distance between 2 points
 * @param {number} A - x coordinate of first element
 * @param {number} B - y coordinate of first element
 * @param {number} C - x coordinate of second element
 * @param {number} D - y coordinate of second element
 * @returns {number} - distance between the elements
 */
const calculateDistance = (A, B, C, D) => {
  const xDiff = A - C;
  const yDiff = B - D;
  return Math.sqrt(Math.pow(xDiff, 2) + Math.sqrt(Math.pow(yDiff, 2)));
};

/**
 * Checks if now is between start and end times.
 * @param {number} start - start time in MS
 * @param {number} end - end time in MS
 * @returns
 */
const isProgramLive = (start, end) => Date.now() >= start && Date.now() <= end;
