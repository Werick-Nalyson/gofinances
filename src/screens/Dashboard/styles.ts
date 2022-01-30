import styled from 'styled-components/native'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { Feather } from '@expo/vector-icons'
import Constants  from 'expo-constants';

import { DataListProps } from '.'
import { FlatList, FlatListProps } from 'react-native';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`

export const Header = styled.View`
    width: 100%;
    height: ${RFPercentage(42)}px;
    background-color: ${({ theme }) => theme.colors.primary};
    align-items: flex-start;
    justify-content: center;
    flex-direction: row;
`

export const UserWrapper = styled.View`
    width: 100%;
    padding: ${RFValue(0)}px ${RFValue(24)}px;
    margin-top: ${RFValue(Constants.statusBarHeight) + RFValue(28)}px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
`

export const Photo = styled.Image`
    width: ${RFValue(48)}px;
    height: ${RFValue(48)}px;
    border-radius: 10px;
`

export const User = styled.View`
    margin-left: 17px;
`

export const UserGretting = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
`

export const UserName = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.bold};
`

export const Icon = styled(Feather)`
    color: ${({ theme }) => theme.colors.secoundary};
    font-size: ${RFValue(24)}px;
`

export const HighlightCards = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: { paddingHorizontal: 24 },
})`
    width: 100%;
    position: absolute;
    margin-top: ${RFPercentage(20)}px;
`

export const Transactions = styled.View`
    flex: 1;
    padding: 0 24px;
    margin-top: ${RFPercentage(12)}px;
`

export const Title = styled.Text`
    margin-bottom: 16px;
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
`

export const TransactionsList = styled(
        FlatList as new (props: FlatListProps<DataListProps>) => FlatList<DataListProps>
    ).attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: {
        paddingBottom: getBottomSpace() + 10,
    }
})``