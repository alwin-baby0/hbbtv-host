import Lightning from '@lightningjs/sdk/src/Lightning';
import HorizontalContainer from '../Components/HorizontalContainer/HorizontalContainer';
import VerticalContainer from '../Components/VerticalContainer/VerticalContainer';

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
