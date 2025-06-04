import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const VChartFunnelConfig: ConfigType = {
  key: 'VChartFunnel',
  chartKey: 'VVChartFunnel',
  conKey: 'VCVChartFunnel',
  title: 'VChart漏斗图',
  category: ChatCategoryEnum.FUNNEL,
  categoryName: ChatCategoryEnumName.FUNNEL,
  package: PackagesCategoryEnum.VCHART,
  chartFrame: ChartFrameEnum.VCHART,
  image: 'vchart_funnel.png'
}
