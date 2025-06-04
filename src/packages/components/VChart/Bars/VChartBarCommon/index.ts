import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const VChartBarCommonConfig: ConfigType = {
  key: 'VChartBarCommon',
  chartKey: 'VVChartBarCommon',
  conKey: 'VCVChartBarCommon',
  title: 'VChart并列柱状图',
  category: ChatCategoryEnum.BAR,
  categoryName: ChatCategoryEnumName.BAR,
  package: PackagesCategoryEnum.VCHART,
  chartFrame: ChartFrameEnum.VCHART,
  image: 'vchart_bar_x.png'
}
