import React from 'react'
import { TouchableOpacityProps } from 'react-native'

import { Container, Icon, Title } from './styles'

const icons = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle'
}

interface Props extends TouchableOpacityProps {
    type: 'up' | 'down';
    isActive: boolean;
    title: string;
}

export function TransactionTypeButton ({ type, title, isActive, ...rest }: Props) {
    return (
        <Container type={type} isActive={isActive} {...rest}>
            <Icon 
                type={type}
                name={icons[type]}
            />
            <Title>{title}</Title>
        </Container>
    )
}