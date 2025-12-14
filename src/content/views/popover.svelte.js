class Popover {
  isShown = $state(false);

  open = () => {
    this.isShown = true;
  };

  close = () => {
    this.isShown = false;
  };
}

export const popover = new Popover();
