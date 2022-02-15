import { RFValue } from 'react-native-responsive-fontsize'
import styled from 'styled-components/native'
import { Feather } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

export const Container = styled(TouchableOpacity).attrs({
   activeOpacity: 0.7,
})`
   width: 100%;
   background-color: ${({ theme }) => theme.colors.shape};
   flex-direction: row;
   justify-content: space-between;
   border-radius: 5px;
   padding: 18px 16px;
`

export const Category = styled.Text`
   font-family: ${({ theme }) => theme.fonts.regular};
   font-size: ${RFValue(14)}px;
   color: ${({ theme }) => theme.colors.text_dark};
`

export const Icon = styled(Feather)`
   font-size: ${RFValue(20)}px;
   color: ${({ theme }) => theme.colors.text};
`