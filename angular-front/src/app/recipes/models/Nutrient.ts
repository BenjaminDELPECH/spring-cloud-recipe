export interface NutrientGroup {
  id: number,
  name: string,
  nameFr: string
}
export interface Nutrient {
  id: number,
  name: string,
  nameFr: string,
  friendlyNameFr: string,
  symbol: string,
  requirement: number,
  unit: string,
  nutrientGroup: NutrientGroup

}
