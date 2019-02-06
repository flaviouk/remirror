import React, { ComponentType, createContext, FC, FunctionComponent } from 'react';

import hoistNonReactStatics from 'hoist-non-react-statics';
import { isEmpty } from 'lodash';
import { Omit } from 'simplytyped';
import { Cast } from './helpers';
import { Remirror } from './remirror';
import { InjectedRemirrorProps, RemirrorProps } from './types';

export const RemirrorContext = createContext<InjectedRemirrorProps>(Cast<InjectedRemirrorProps>({}));

export const RemirrorProvider: FC<RemirrorProps> = ({ children, ...props }) => {
  return (
    <Remirror {...props}>
      {value => <RemirrorContext.Provider value={value}>{children}</RemirrorContext.Provider>}
    </Remirror>
  );
};

const checkValidRenderPropParams = (params: InjectedRemirrorProps) => {
  if (isEmpty(params)) {
    throw new Error('No props received for the Text Editor Params');
  }
  return true;
};

export const withRemirror = <GProps extends InjectedRemirrorProps>(Wrapped: ComponentType<GProps>) => {
  type EnhancedComponentProps = Omit<GProps, keyof InjectedRemirrorProps>;
  const EnhancedComponent: FunctionComponent<EnhancedComponentProps> = props => {
    return (
      <RemirrorContext.Consumer>
        {params => {
          checkValidRenderPropParams(params);
          return <Wrapped {...Cast<GProps>({ ...props, ...params })} />;
        }}
      </RemirrorContext.Consumer>
    );
  };

  return hoistNonReactStatics(EnhancedComponent, Wrapped);
};
