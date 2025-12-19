class Popover {
  isShown = $state(false);
  params = $state({});

  open = (params) => {
    this.isShown = true;
    this.params = params;
  };

  close = () => {
    this.isShown = false;
    this.params = {};
  };
}

export const popover = new Popover();
